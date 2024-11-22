import createExpense from './create-expense.js';
import deleteExpense from './delete-expense.js';
import updateExpense from './update-expense.js';

export default class ExpenseCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createExpense(params) {
    return createExpense({
      ...params,
      expenseCtrl: this,
    });
  }

  async deleteExpense(params) {
    return deleteExpense({
      ...params,
      expenseCtrl: this,
    });
  }

  async updateExpense(params) {
    return updateExpense({
      ...params,
      expenseCtrl: this,
    });
  }
}
