import chai from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';
import { EmployerError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Controllers - EmployerCtrl.updateEmployer', function() {
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
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
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
      await controllers.EmployerCtrl.updateEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: null,
        name: sampleData.employers.employer2.name,
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

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.EmployerCtrl.updateEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: user1EmployerUuid,
        name: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Name is required');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.EmployerCtrl.updateEmployer({
        auditApiCallUuid: null,
        employerUuid: user1EmployerUuid,
        name: sampleData.employers.employer2.name,
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
      await controllers.EmployerCtrl.updateEmployer({
        auditApiCallUuid: uuidv4(),
        employerUuid: user1EmployerUuid,
        name: sampleData.employers.employer2.name,
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
      await controllers.EmployerCtrl.updateEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: user1EmployerUuid,
        name: sampleData.employers.employer2.name,
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
      await controllers.EmployerCtrl.updateEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: uuidv4(),
        name: sampleData.employers.employer2.name,
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
      await controllers.EmployerCtrl.updateEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        employerUuid: user1EmployerUuid,
        name: sampleData.employers.employer2.name,
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

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.EmployerCtrl.updateEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      employerUuid: user1EmployerUuid,
      name: sampleData.employers.employer1.name,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the employer name', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.EmployerCtrl.updateEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      employerUuid: user1EmployerUuid,
      name: sampleData.employers.employer2.name,
    });

    // Verify the Employer instance.
    const employer = await models.Employer.findOne({
      attributes: ['household_uuid', 'name', 'uuid'],
      where: {
        uuid: user1EmployerUuid,
      },
    });
    assert.isOk(employer);
    assert.strictEqual(employer.get('household_uuid'), user1HouseholdUuid);
    assert.strictEqual(employer.get('name'), sampleData.employers.employer2.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateEmployer = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Employer
        && updateInstance.get('uuid') === user1EmployerUuid;
    });
    assert.isOk(updateEmployer);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
