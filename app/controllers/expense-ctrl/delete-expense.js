import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import Sequelize from 'sequelize';

import { ExpenseError } from '../../middleware/error-handler/index.js';

/**
 * @param {string} auditApiCallUuid
 * @param {object} expenseCtrl Instance of ExpenseCtrl
 * @param {string} expenseUuid UUID of the expense to delete
 */
export default async({
  auditApiCallUuid,
  expenseCtrl,
  expenseUuid,
}) => {
  const controllers = expenseCtrl.parent;
  const models = expenseCtrl.models;
  if (!expenseUuid) {
    throw new ExpenseError('Expense is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new ExpenseError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new ExpenseError('Audit user does not exist');
  }

  const expense = await models.Expense.findOne({
    attributes: ['amount_cents', 'fund_uuid', 'reimbursed_cents', 'uuid'],
    include: [{
      attributes: [
        'aws_bucket',
        'aws_key',
        'entity_type',
        'entity_uuid',
        'uuid',
      ],
      model: models.Attachment,
      required: false,
    }, {
      attributes: ['uuid'],
      model: models.HouseholdMember,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }, {
      attributes: ['uuid'],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
        where: {
          household_uuid: user.get('household_uuid'),
        },
      }],
      model: models.Subcategory,
      required: true,
    }, {
      attributes: ['uuid'],
      model: models.Vendor,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: expenseUuid,
    },
  });
  if (!expense) {
    throw new ExpenseError('Not found');
  }
  if (expense.get('fund_uuid')) {
    const fund = await models.Fund.findOne({
      attributes: ['uuid'],
      where: {
        household_uuid: user.get('household_uuid'),
        uuid: expense.get('fund_uuid'),
      },
    });
    if (!fund) {
      throw new ExpenseError('Not found');
    }
  }

  const deleteList = [expense];
  for (const attachment of expense.Attachments) {
    if (attachment.get('aws_bucket') && attachment.get('aws_key')) {
      // eslint-disable-next-line no-await-in-loop
      await controllers.AttachmentCtrl.s3Client.send(new DeleteObjectCommand({
        Bucket: attachment.get('aws_bucket'),
        Key: attachment.get('aws_key'),
      }));
    }
    deleteList.push(attachment);
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    const trackChangesParams = {
      auditApiCallUuid,
      deleteList,
      transaction,
    };
    if (expense.get('fund_uuid')) {
      const trackedFund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        transaction,
        where: {
          uuid: expense.get('fund_uuid'),
        },
      });
      trackedFund.set('balance_cents', trackedFund.get('balance_cents') + (expense.get('amount_cents') - expense.get('reimbursed_cents')));
      trackChangesParams.changeList = [trackedFund];
    }
    await controllers.AuditCtrl.trackChanges(trackChangesParams);
  });
};
