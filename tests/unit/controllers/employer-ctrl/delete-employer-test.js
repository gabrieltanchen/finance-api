import chai from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';
import { EmployerError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Controllers - EmployerCtrl.deleteEmployer', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1EmployerUuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user2Uuid;

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  before('create sinon spies', function() {
    trackChangesSpy = sinon.spy(controllers.AuditCtrl, 'trackChanges');
  });

  after('restore sinon spies', function() {
    trackChangesSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user 1', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    user1HouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    user1Uuid = user.get('uuid');
  });

  beforeEach('create user 1 employer', async function() {
    const employer = await models.Employer.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.employers.employer1.name,
    });
    user1EmployerUuid = employer.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user2.lastName,
    });
    const user = await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
    user2Uuid = user.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no employer UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.EmployerCtrl.deleteEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Employer is required');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.EmployerCtrl.deleteEmployer({
        auditApiCallUuid: null,
        employerUuid: user1EmployerUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.EmployerCtrl.deleteEmployer({
        auditApiCallUuid: uuidv4(),
        employerUuid: user1EmployerUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the user does not exist', async function() {
    try {
      await models.User.destroy({
        where: {
          uuid: user1Uuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.EmployerCtrl.deleteEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: user1EmployerUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the employer does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.EmployerCtrl.deleteEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the employer belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.EmployerCtrl.deleteEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: user1EmployerUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve when the employer belongs to the user\'s household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.EmployerCtrl.deleteEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      employerUuid: user1EmployerUuid,
    });

    // Verify that the Employer instance is deleted.
    const employer = await models.Employer.findOne({
      attributes: ['uuid'],
      where: {
        uuid: user1EmployerUuid,
      },
    });
    assert.isNull(employer);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isOk(trackChangesParams.deleteList);
    const deleteCategory = _.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.Employer
        && deleteInstance.get('uuid') === user1EmployerUuid;
    });
    assert.isOk(deleteCategory);
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when the employer has an income', function() {
    let user1HouseholdMemberUuid;
    let user1IncomeUuid;

    beforeEach('create user 1 household member', async function() {
      const householdMember = await models.HouseholdMember.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.users.user1.firstName,
      });
      user1HouseholdMemberUuid = householdMember.get('uuid');
    });

    beforeEach('create user 1 income', async function() {
      const income = await models.Income.create({
        amount_cents: sampleData.incomes.income1.amount_cents,
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        employer_uuid: user1EmployerUuid,
        household_member_uuid: user1HouseholdMemberUuid,
      });
      user1IncomeUuid = income.get('uuid');
    });

    it('should reject when deleting the employer', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.EmployerCtrl.deleteEmployer({
          auditApiCallUuid: apiCall.get('uuid'),
          employerUuid: user1EmployerUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Cannot delete with incomes.');
        assert.isTrue(err instanceof EmployerError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve if the income is deleted', async function() {
      await models.Income.destroy({
        where: {
          uuid: user1IncomeUuid,
        },
      });

      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.EmployerCtrl.deleteEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: user1EmployerUuid,
      });

      // Verify that the Employer instance is deleted.
      const employer = await models.Employer.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1EmployerUuid,
        },
      });
      assert.isNull(employer);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      const deleteCategory = _.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Employer
          && deleteInstance.get('uuid') === user1EmployerUuid;
      });
      assert.isOk(deleteCategory);
      assert.strictEqual(trackChangesParams.deleteList.length, 1);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });
});
