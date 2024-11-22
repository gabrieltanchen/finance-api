import Sequelize from 'sequelize';

import { AttachmentError } from '../../middleware/error-handler/index.js';

/**
 * @param {object} attachmentCtrl Instance of AttachmentCtrl
 * @param {string} attachmentUuid
 * @param {string} auditApiCallUuid
 * @param {string} name
 *
 */
export default async({
  attachmentCtrl,
  attachmentUuid,
  auditApiCallUuid,
  name,
}) => {
  const controllers = attachmentCtrl.parent;
  const models = attachmentCtrl.models;
  if (!attachmentUuid) {
    throw new AttachmentError('Attachment is required');
  } else if (!name) {
    throw new AttachmentError('Name is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new AttachmentError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new AttachmentError('Audit user does not exist');
  }

  const attachment = await models.Attachment.findOne({
    attributes: ['name', 'uuid'],
    include: [{
      as: 'Expense',
      attributes: ['uuid'],
      include: [{
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
      }],
      model: models.Expense,
      required: true,
    }],
    where: {
      uuid: attachmentUuid,
    },
  });
  if (!attachment) {
    throw new AttachmentError('Not found');
  }

  if (name !== attachment.get('name')) {
    attachment.set('name', name);
  }

  if (attachment.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [attachment],
        transaction,
      });
    });
  }
};
