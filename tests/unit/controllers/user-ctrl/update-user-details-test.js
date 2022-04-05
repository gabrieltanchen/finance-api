const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { UserError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - UserCtrl.updateUserDetails', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdUuid;
  let user1Uuid;
  let user2Uuid;
  let user3Uuid;

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
      email: sampleData.users.user1.email.toLowerCase(),
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    user1Uuid = user.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const user = await models.User.create({
      email: sampleData.users.user2.email.toLowerCase(),
      first_name: sampleData.users.user2.firstName,
      household_uuid: user1HouseholdUuid,
      last_name: sampleData.users.user2.lastName,
    });
    user2Uuid = user.get('uuid');
  });

  beforeEach('create user 3', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user3.lastName,
    });
    const user = await models.User.create({
      email: sampleData.users.user3.email.toLowerCase(),
      first_name: sampleData.users.user3.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user3.lastName,
    });
    user3Uuid = user.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no user UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.user4.email,
        firstName: sampleData.users.user4.firstName,
        lastName: sampleData.users.user4.lastName,
        userUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'User is required');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no email', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid1.email,
        firstName: sampleData.users.invalid1.firstName,
        lastName: sampleData.users.invalid1.lastName,
        userUuid: user2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Email is required');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no first name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid2.email,
        firstName: sampleData.users.invalid2.firstName,
        lastName: sampleData.users.invalid2.lastName,
        userUuid: user2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'First name is required');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no last name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid3.email,
        firstName: sampleData.users.invalid3.firstName,
        lastName: sampleData.users.invalid3.lastName,
        userUuid: user2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Last name is required');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: null,
        email: sampleData.users.user4.email,
        firstName: sampleData.users.user4.firstName,
        lastName: sampleData.users.user4.lastName,
        userUuid: user2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: uuidv4(),
        email: sampleData.users.user4.email,
        firstName: sampleData.users.user4.firstName,
        lastName: sampleData.users.user4.lastName,
        userUuid: user2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit user does not exist', async function() {
    try {
      await models.User.destroy({
        where: {
          uuid: user1Uuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.user4.email,
        firstName: sampleData.users.user4.firstName,
        lastName: sampleData.users.user4.lastName,
        userUuid: user2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the user does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.user4.email,
        firstName: sampleData.users.user4.firstName,
        lastName: sampleData.users.user4.lastName,
        userUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the user belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user3Uuid,
      });
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.user4.email,
        firstName: sampleData.users.user4.firstName,
        lastName: sampleData.users.user4.lastName,
        userUuid: user2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.UserCtrl.updateUserDetails({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      userUuid: user2Uuid,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the email', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.UserCtrl.updateUserDetails({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user4.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      userUuid: user2Uuid,
    });

    // Verify the User instance.
    const user = await models.User.findOne({
      attributes: [
        'email',
        'first_name',
        'last_name',
        'uuid',
      ],
      where: {
        uuid: user2Uuid,
      },
    });
    assert.isOk(user);
    assert.strictEqual(user.get('email'), sampleData.users.user4.email.toLowerCase());
    assert.strictEqual(user.get('first_name'), sampleData.users.user2.firstName);
    assert.strictEqual(user.get('last_name'), sampleData.users.user2.lastName);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateUser = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.User
        && updateInstance.get('uuid') === user2Uuid;
    });
    assert.isOk(updateUser);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the first name', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.UserCtrl.updateUserDetails({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user4.firstName,
      lastName: sampleData.users.user2.lastName,
      userUuid: user2Uuid,
    });

    // Verify the User instance.
    const user = await models.User.findOne({
      attributes: [
        'email',
        'first_name',
        'last_name',
        'uuid',
      ],
      where: {
        uuid: user2Uuid,
      },
    });
    assert.isOk(user);
    assert.strictEqual(user.get('email'), sampleData.users.user2.email.toLowerCase());
    assert.strictEqual(user.get('first_name'), sampleData.users.user4.firstName);
    assert.strictEqual(user.get('last_name'), sampleData.users.user2.lastName);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateUser = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.User
        && updateInstance.get('uuid') === user2Uuid;
    });
    assert.isOk(updateUser);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the last name', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.UserCtrl.updateUserDetails({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user4.lastName,
      userUuid: user2Uuid,
    });

    // Verify the User instance.
    const user = await models.User.findOne({
      attributes: [
        'email',
        'first_name',
        'last_name',
        'uuid',
      ],
      where: {
        uuid: user2Uuid,
      },
    });
    assert.isOk(user);
    assert.strictEqual(user.get('email'), sampleData.users.user2.email.toLowerCase());
    assert.strictEqual(user.get('first_name'), sampleData.users.user2.firstName);
    assert.strictEqual(user.get('last_name'), sampleData.users.user4.lastName);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateUser = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.User
        && updateInstance.get('uuid') === user2Uuid;
    });
    assert.isOk(updateUser);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating all attributes', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.UserCtrl.updateUserDetails({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user4.email,
      firstName: sampleData.users.user4.firstName,
      lastName: sampleData.users.user4.lastName,
      userUuid: user2Uuid,
    });

    // Verify the User instance.
    const user = await models.User.findOne({
      attributes: [
        'email',
        'first_name',
        'last_name',
        'uuid',
      ],
      where: {
        uuid: user2Uuid,
      },
    });
    assert.isOk(user);
    assert.strictEqual(user.get('email'), sampleData.users.user4.email.toLowerCase());
    assert.strictEqual(user.get('first_name'), sampleData.users.user4.firstName);
    assert.strictEqual(user.get('last_name'), sampleData.users.user4.lastName);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateUser = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.User
        && updateInstance.get('uuid') === user2Uuid;
    });
    assert.isOk(updateUser);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
