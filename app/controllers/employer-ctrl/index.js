import createEmployer from './create-employer.js';
import deleteEmployer from './delete-employer.js';
import updateEmployer from './update-employer.js';

export default class EmployerCtrl {
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
