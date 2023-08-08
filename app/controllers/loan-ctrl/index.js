const createLoan = require('./create-loan');
const createLoanPayment = require('./create-loan-payment');
const deleteLoan = require('./delete-loan');
const updateLoan = require('./update-loan');
const updateLoanPayment = require('./update-loan-payment');

class LoanCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createLoan(params) {
    return createLoan({
      ...params,
      loanCtrl: this,
    });
  }

  async createLoanPayment(params) {
    return createLoanPayment({
      ...params,
      loanCtrl: this,
    });
  }

  async deleteLoan(params) {
    return deleteLoan({
      ...params,
      loanCtrl: this,
    });
  }

  async updateLoan(params) {
    return updateLoan({
      ...params,
      loanCtrl: this,
    });
  }

  async updateLoanPayment(params) {
    return updateLoanPayment({
      ...params,
      loanCtrl: this,
    });
  }
}

module.exports = LoanCtrl;
