const createEmployer = require('./create-employer');
const deleteEmployer = require('./delete-employer');
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

  async deleteEmployer({
    auditApiCallUuid,
    employerUuid,
  }) {
    return deleteEmployer({
      auditApiCallUuid,
      employerCtrl: this,
      employerUuid,
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
