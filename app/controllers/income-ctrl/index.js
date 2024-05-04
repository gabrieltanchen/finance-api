const createIncome = require('./create-income');
const deleteIncome = require('./delete-income');
const updateIncome = require('./update-income');

class IncomeCtrl {
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

module.exports = IncomeCtrl;
