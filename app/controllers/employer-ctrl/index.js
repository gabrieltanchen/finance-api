const createEmployer = require('./create-employer');
const updateEmployer = require('./update-employer');

class EmployerCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createEmployer({
    auditApiCallUuid,
    name,
  }) {
    return createEmployer({
      auditApiCallUuid,
      employerCtrl: this,
      name,
    });
  }

  async updateEmployer({
    auditApiCallUuid,
    employerUuid,
    name,
  }) {
    return updateEmployer({
      auditApiCallUuid,
      employerCtrl: this,
      employerUuid,
      name,
    });
  }
}

module.exports = EmployerCtrl;
