import createIncome from './create-income.js';
import deleteIncome from './delete-income.js';
import updateIncome from './update-income.js';

export default class IncomeCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createIncome({
    amount,
    auditApiCallUuid,
    date,
    description,
    employerUuid,
    householdMemberUuid,
  }) {
    return createIncome({
      amount,
      auditApiCallUuid,
      date,
      description,
      employerUuid,
      householdMemberUuid,
      incomeCtrl: this,
    });
  }

  async deleteIncome({
    auditApiCallUuid,
    incomeUuid,
  }) {
    return deleteIncome({
      auditApiCallUuid,
      incomeCtrl: this,
      incomeUuid,
    });
  }

  async updateIncome({
    amount,
    auditApiCallUuid,
    date,
    description,
    employerUuid,
    householdMemberUuid,
    incomeUuid,
  }) {
    return updateIncome({
      amount,
      auditApiCallUuid,
      date,
      description,
      employerUuid,
      householdMemberUuid,
      incomeCtrl: this,
      incomeUuid,
    });
  }
}
