const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { EmployerError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - EmployerCtrl.createEmployer', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let userHouseholdUuid;
  let userUuid;

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

  beforeEach('create user', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    userHouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    userUuid = user.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: userUuid,
      });
      await controllers.EmployerCtrl.createEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        name: null,
      });
      /* istanbul ignore next */
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Name is required');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.EmployerCtrl.createEmployer({
        auditApiCallUuid: null,
        name: sampleData.employers.employer1.name,
      });
      /* istanbul ignore next */
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.EmployerCtrl.createEmployer({
        auditApiCallUuid: uuidv4(),
        name: sampleData.employers.employer1.name,
      });
      /* istanbul ignore next */
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
          uuid: userUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: userUuid,
      });
      await controllers.EmployerCtrl.createEmployer({
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.employers.employer1.name,
      });
      /* istanbul ignore next */
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof EmployerError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating an employer', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    const employerUuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer1.name,
    });

    assert.isOk(employerUuid);

    // Verify the Employer instance.
    const employer = await models.Employer.findOne({
      attributes: ['household_uuid', 'name', 'uuid'],
      where: {
        uuid: employerUuid,
      },
    });
    assert.isOk(employer);
    assert.strictEqual(employer.get('household_uuid'), userHouseholdUuid);
    assert.strictEqual(employer.get('name'), sampleData.employers.employer1.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newEmployer = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Employer
        && newInstance.get('uuid') === employer.get('uuid');
    });
    assert.isOk(newEmployer);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });
});
