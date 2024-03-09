const createEmployer = require('./create-employer');

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
}

module.exports = EmployerCtrl;
