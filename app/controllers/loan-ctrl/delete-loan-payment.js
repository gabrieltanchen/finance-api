import Sequelize from 'sequelize';

import { LoanError } from '../../middleware/error-handler/index.js';

/**
 * @param {string} auditApiCallUuid
 * @param {object} loanCtrl Instance of LoanCtrl
 * @param {string} loanPaymentUuid UUID of the loan payment to delete
 */
export default async({
  auditApiCallUuid,
  loanCtrl,
  loanPaymentUuid,
}) => {
  const controllers = loanCtrl.parent;
  const models = loanCtrl.models;
  if (!loanPaymentUuid) {
    throw new LoanError('Loan payment is required');
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

  const loanPayment = await models.LoanPayment.findOne({
    attributes: ['principal_amount_cents', 'uuid'],
    include: [{
      attributes: ['uuid'],
      model: models.Loan,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: loanPaymentUuid,
    },
  });
  if (!loanPayment) {
    throw new LoanError('Loan payment not found');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    const trackedLoan = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      transaction,
      where: {
        uuid: loanPayment.Loan.get('uuid'),
      },
    });
    trackedLoan.set('balance_cents', trackedLoan.get('balance_cents') + loanPayment.get('principal_amount_cents'));
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      changeList: [trackedLoan],
      deleteList: [loanPayment],
      transaction,
    });
  });
};
