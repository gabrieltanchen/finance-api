const Sequelize = require('sequelize');

const { LoanError } = require('../../middleware/error-handler');

/**
 * @param {integer} amount
 * @param {string} auditApiCallUuid
 * @param {object} loanCtrl
 * @param {string} name
 */
module.exports = async({
  amount,
  auditApiCallUuid,
  loanCtrl,
  name,
}) => {
  const controllers = loanCtrl.parent;
  const models = loanCtrl.models;
  if (!name) {
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

  const loanAmount = parseInt(amount, 10);
  const newLoan = models.Loan.build({
    amount_cents: loanAmount,
    balance_cents: loanAmount,
    household_uuid: user.get('household_uuid'),
    name,
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newLoan.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newLoan],
      transaction,
    });
  });

  return newLoan.get('uuid');
};
