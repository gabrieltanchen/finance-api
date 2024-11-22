import createMember from './create-member.js';
import deleteMember from './delete-member.js';
import updateMember from './update-member.js';

export default class HouseholdCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createMember({
    auditApiCallUuid,
    name,
  }) {
    return createMember({
      auditApiCallUuid,
      householdCtrl: this,
      name,
    });
  }

  async deleteMember({
    auditApiCallUuid,
    householdMemberUuid,
  }) {
    return deleteMember({
      auditApiCallUuid,
      householdCtrl: this,
      householdMemberUuid,
    });
  }

  async updateMember({
    auditApiCallUuid,
    householdMemberUuid,
    name,
  }) {
    return updateMember({
      auditApiCallUuid,
      householdCtrl: this,
      householdMemberUuid,
      name,
    });
  }
}
