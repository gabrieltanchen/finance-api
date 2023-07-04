const createLoan = require('./create-loan');

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
}

module.exports = LoanCtrl;
