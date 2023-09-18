const moment = require('moment');
const Sequelize = require('sequelize');

const { LoanError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {string} date
 * @param {integer} interestAmount
 * @param {object} loanCtrl Instance of LoanCtrl
 * @param {string} loanUuid
 * @param {integer} principalAmount
 */
module.exports = async({
  auditApiCallUuid,
  date,
  interestAmount,
  loanCtrl,
  loanUuid,
  principalAmount,
}) => {
  const controllers = loanCtrl.parent;
  const models = loanCtrl.models;
  if (!loanUuid) {
    throw new LoanError('Loan is required');
  } else if (!moment.utc(date).isValid()) {
    throw new LoanError('Invalid date');
  } else if (isNaN(parseInt(principalAmount, 10))) {
    throw new LoanError('Invalid principal amount');
  } else if (isNaN(parseInt(interestAmount, 10))) {
    throw new LoanError('Invalid interest amount');
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

  // Validate loan belongs to household.
  const loan = await models.Loan.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: loanUuid,
    },
  });
  if (!loan) {
    throw new LoanError('Loan not found');
  }

  const newLoanPayment = models.LoanPayment.build({
    date: moment.utc(date).format('YYYY-MM-DD'),
    interest_amount_cents: parseInt(interestAmount, 10),
    loan_uuid: loan.get('uuid'),
    principal_amount_cents: parseInt(principalAmount, 10),
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    const trackedLoan = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      transaction,
      where: {
        uuid: newLoanPayment.get('loan_uuid'),
      },
    });
    trackedLoan.set('balance_cents', trackedLoan.get('balance_cents') - newLoanPayment.get('principal_amount_cents'));
    await newLoanPayment.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      changeList: [trackedLoan],
      newList: [newLoanPayment],
      transaction,
    });
  });

  return newLoanPayment.get('uuid');
};
