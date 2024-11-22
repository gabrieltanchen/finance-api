import createLoan from './create-loan.js';
import createLoanPayment from './create-loan-payment.js';
import deleteLoan from './delete-loan.js';
import deleteLoanPayment from './delete-loan-payment.js';
import updateLoan from './update-loan.js';
import updateLoanPayment from './update-loan-payment.js';

export default class LoanCtrl {
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

  async deleteLoanPayment(params) {
    return deleteLoanPayment({
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
