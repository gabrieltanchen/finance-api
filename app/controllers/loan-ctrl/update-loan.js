import Sequelize from 'sequelize';

import { LoanError } from '../../middleware/error-handler/index.js';

/**
 * @param {integer} amount
 * @param {string} auditApiCallUuid
 * @param {object} loanCtrl Instance of LoanCtrl
 * @param {string} loanUuid UUID of the loan to update
 * @param {string} name
 */
export default async({
  amount,
  auditApiCallUuid,
  loanCtrl,
  loanUuid,
  name,
}) => {
  const controllers = loanCtrl.parent;
  const models = loanCtrl.models;
  if (!loanUuid) {
    throw new LoanError('Loan is required');
  } else if (!name) {
    throw new LoanError('Name is required');
  } else if (isNaN(parseInt(amount, 10))) {
    throw new LoanError('Invalid amount');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new LoanError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new LoanError('Audit user does not exist');
  }

  const loan = await models.Loan.findOne({
    attributes: ['amount_cents', 'balance_cents', 'name', 'uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: loanUuid,
    },
  });
  if (!loan) {
    throw new LoanError('Not found');
  }

  if (name !== loan.get('name')) {
    loan.set('name', name);
  }
  if (amount !== loan.get('amount_cents')) {
    loan.set('balance_cents', loan.get('balance_cents') + (amount - loan.get('amount_cents')));
    loan.set('amount_cents', amount);
  }

  if (loan.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [loan],
        transaction,
      });
    });
  }
};
