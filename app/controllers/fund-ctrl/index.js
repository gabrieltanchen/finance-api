const createDeposit = require('./create-deposit');
const createFund = require('./create-fund');
const deleteDeposit = require('./delete-deposit');
const deleteFund = require('./delete-fund');
const updateDeposit = require('./update-deposit');
const updateFund = require('./update-fund');

class FundCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createDeposit(params) {
    return createDeposit({
      ...params,
      fundCtrl: this,
    });
  }

  async createFund(params) {
    return createFund({
      ...params,
      fundCtrl: this,
    });
  }

  async deleteDeposit(params) {
    return deleteDeposit({
      ...params,
      fundCtrl: this,
    });
  }

  async deleteFund(params) {
    return deleteFund({
      ...params,
      fundCtrl: this,
    });
  }

  async updateDeposit(params) {
    return updateDeposit({
      ...params,
      fundCtrl: this,
    });
  }

  async updateFund(params) {
    return updateFund({
      ...params,
      fundCtrl: this,
    });
  }
}

module.exports = FundCtrl;
