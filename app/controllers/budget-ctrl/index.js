const createBudget = require('./create-budget');
const deleteBudget = require('./delete-budget');
const updateBudget = require('./update-budget');

class BudgetCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createBudget(params) {
    return createBudget({
      ...params,
      budgetCtrl: this,
    });
  }

  async deleteBudget(params) {
    return deleteBudget({
      ...params,
      budgetCtrl: this,
    });
  }

  async updateBudget(params) {
    return updateBudget({
      ...params,
      budgetCtrl: this,
    });
  }
}

module.exports = BudgetCtrl;
