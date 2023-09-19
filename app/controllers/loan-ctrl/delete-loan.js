const Sequelize = require('sequelize');

const { LoanError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} loanCtrl Instance of LoanCtrl
 * @param {string} loanUuid UUID of the loan to delete
 */
module.exports = async({
  auditApiCallUuid,
  loanCtrl,
  loanUuid,
}) => {
  const controllers = loanCtrl.parent;
  const models = loanCtrl.models;
  if (!loanUuid) {
    throw new LoanError('Loan is required');
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
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: loanUuid,
    },
  });
  if (!loan) {
    throw new LoanError('Not found');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [loan],
      transaction,
    });
  });
};
