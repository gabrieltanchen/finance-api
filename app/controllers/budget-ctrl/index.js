import createBudget from './create-budget.js';
import deleteBudget from './delete-budget.js';
import updateBudget from './update-budget.js';

export default class BudgetCtrl {
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
