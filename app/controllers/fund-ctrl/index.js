import createDeposit from './create-deposit.js';
import createFund from './create-fund.js';
import deleteDeposit from './delete-deposit.js';
import deleteFund from './delete-fund.js';
import updateDeposit from './update-deposit.js';
import updateFund from './update-fund.js';

export default class FundCtrl {
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
