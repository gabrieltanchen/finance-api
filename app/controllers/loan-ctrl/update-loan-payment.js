const moment = require('moment');
const Sequelize = require('sequelize');

const { LoanError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {string} date
 * @param {integer} interestAmount
 * @param {object} loanCtrl Instance of LoanCtrl
 * @param {string} loanPaymentUuid
 * @param {string} loanUuid
 * @param {integer} principalAmount
 */
module.exports = async({
  auditApiCallUuid,
  date,
  interestAmount,
  loanCtrl,
  loanPaymentUuid,
  loanUuid,
  principalAmount,
}) => {
  const controllers = loanCtrl.parent;
  const models = loanCtrl.models;
  if (!loanPaymentUuid) {
    throw new LoanError('Loan payment is required');
  } else if (!loanUuid) {
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

  const loanPayment = await models.LoanPayment.findOne({
    attributes: [
      'date',
      'interest_amount_cents',
      'loan_uuid',
      'principal_amount_cents',
      'uuid',
    ],
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

  const oldPrincipalAmount = loanPayment.get('principal_amount_cents');
  let newPrincipalAmount = oldPrincipalAmount;
  if (loanPayment.get('principal_amount_cents') !== parseInt(principalAmount, 10)) {
    loanPayment.set('principal_amount_cents', parseInt(principalAmount, 10));
    newPrincipalAmount = loanPayment.get('principal_amount_cents');
  }
  if (loanPayment.get('interest_amount_cents') !== parseInt(interestAmount, 10)) {
    loanPayment.set('interest_amount_cents', parseInt(interestAmount, 10));
  }
  if (moment(loanPayment.get('date')).format('YYYY-MM-DD') !== moment.utc(date).format('YYYY-MM-DD')) {
    loanPayment.set('date', moment.utc(date).format('YYYY-MM-DD'));
  }

  // Validate loan UUID.
  const oldLoanUuid = loanPayment.get('loan_uuid');
  let newLoanUuid = oldLoanUuid;
  if (loanUuid !== loanPayment.get('loan_uuid')) {
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
    loanPayment.set('loan_uuid', loan.get('uuid'));
    newLoanUuid = loanPayment.get('loan_uuid');
  }

  if (loanPayment.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      const changeList = [loanPayment];
      if (loanPayment.changed('loan_uuid')) {
        // The loan is being changed, so we need to subtract the loan payment principal amount
        // from the old loan and add to the new loan.
        const oldTrackedLoan = await models.Loan.findOne({
          attributes: ['balance_cents', 'uuid'],
          transaction,
          where: {
            uuid: oldLoanUuid,
          },
        });
        // Use oldPrincipalAmount because that's the amount that would have been added previously.
        oldTrackedLoan.set('balance_cents', oldTrackedLoan.get('balance_cents') + oldPrincipalAmount);
        changeList.push(oldTrackedLoan);
        const newTrackedLoan = await models.Loan.findOne({
          attributes: ['balance_cents', 'uuid'],
          transaction,
          where: {
            uuid: newLoanUuid,
          },
        });
        // Use newPrincipalAmount in case the amount is also being updated.
        newTrackedLoan.set('balance_cents', newTrackedLoan.get('balance_cents') - newPrincipalAmount);
        changeList.push(newTrackedLoan);
      } else if (loanPayment.changed('principal_amount_cents')) {
        // Simply update the loan balance with the difference of the old and
        // new amounts.
        const trackedLoan = await models.Loan.findOne({
          attributes: ['balance_cents', 'uuid'],
          transaction,
          where: {
            uuid: oldLoanUuid,
          },
        });
        trackedLoan.set('balance_cents', trackedLoan.get('balance_cents') - (newPrincipalAmount - oldPrincipalAmount));
        changeList.push(trackedLoan);
      }
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList,
        transaction,
      });
    });
  }
};
