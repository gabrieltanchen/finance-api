const createLoan = require('./create-loan');
const deleteLoan = require('./delete-loan');
const updateLoan = require('./update-loan');

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
}

module.exports = LoanCtrl;
