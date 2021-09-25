const chai = require('chai');
const crypto = require('crypto');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { UserError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - UserCtrl.addUserToHousehold', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdUuid;
  let user1Uuid;

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

  beforeEach('create first user', async function() {
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

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no email', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.addUserToHousehold({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid1.email,
        firstName: sampleData.users.invalid1.firstName,
        lastName: sampleData.users.invalid1.lastName,
        password: sampleData.users.invalid1.password,
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
      await controllers.UserCtrl.addUserToHousehold({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid2.email,
        firstName: sampleData.users.invalid2.firstName,
        lastName: sampleData.users.invalid2.lastName,
        password: sampleData.users.invalid2.password,
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
      await controllers.UserCtrl.addUserToHousehold({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid3.email,
        firstName: sampleData.users.invalid3.firstName,
        lastName: sampleData.users.invalid3.lastName,
        password: sampleData.users.invalid3.password,
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

  it('should reject with no password', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.addUserToHousehold({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid4.email,
        firstName: sampleData.users.invalid4.firstName,
        lastName: sampleData.users.invalid4.lastName,
        password: sampleData.users.invalid4.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Password is required');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with a short password', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.UserCtrl.addUserToHousehold({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid6.email,
        firstName: sampleData.users.invalid6.firstName,
        lastName: sampleData.users.invalid6.lastName,
        password: sampleData.users.invalid6.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Password must be at least 8 characters');
      assert.isTrue(err instanceof UserError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.UserCtrl.addUserToHousehold({
        auditApiCallUuid: null,
        email: sampleData.users.user2.email,
        firstName: sampleData.users.user2.firstName,
        lastName: sampleData.users.user2.lastName,
        password: sampleData.users.user2.password,
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
      await controllers.UserCtrl.addUserToHousehold({
        auditApiCallUuid: uuidv4(),
        email: sampleData.users.user2.email,
        firstName: sampleData.users.user2.firstName,
        lastName: sampleData.users.user2.lastName,
        password: sampleData.users.user2.password,
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

  it('should create a new user with the same household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const newUserUuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      password: sampleData.users.user2.password,
    });

    assert.isOk(newUserUuid);

    // Verify the new User instance.
    const newUser = await models.User.findOne({
      attributes: ['email', 'first_name', 'household_uuid', 'last_name', 'uuid'],
      where: {
        uuid: newUserUuid,
      },
    });
    assert.isOk(newUser);
    assert.strictEqual(newUser.get('email'), sampleData.users.user2.email.toLowerCase());
    assert.strictEqual(newUser.get('first_name'), sampleData.users.user2.firstName);
    assert.strictEqual(newUser.get('last_name'), sampleData.users.user2.lastName);
    assert.strictEqual(newUser.get('household_uuid'), user1HouseholdUuid);

    // Verify the new UserLogin instance.
    const newUserLogin = await models.UserLogin.findOne({
      attributes: ['h2', 's1', 'user_uuid'],
      where: {
        user_uuid: newUser.get('uuid'),
      },
    });
    assert.isOk(newUserLogin);
    assert.isOk(newUserLogin.get('h2'));
    assert.isOk(newUserLogin.get('s1'));
    const h1 = (await crypto.scryptSync(
      sampleData.users.user2.password,
      newUserLogin.get('s1'),
      96,
      controllers.UserCtrl.hashParams,
    )).toString('base64');
    const hash = await models.Hash.findOne({
      attributes: ['h1', 's2'],
      where: {
        h1,
      },
    });
    assert.isOk(hash);
    const h2 = (await crypto.scryptSync(
      sampleData.users.user2.password,
      hash.get('s2'),
      96,
      controllers.UserCtrl.hashParams,
    )).toString('base64');
    assert.strictEqual(newUserLogin.get('h2'), h2);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    assert.isOk(_.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.User
        && newInstance.get('uuid') === newUser.get('uuid');
    }));
    assert.isOk(_.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.UserLogin
        && newInstance.get('user_uuid') === newUser.get('uuid');
    }));
    assert.strictEqual(trackChangesParams.newList.length, 2);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when the email already exists', function() {
    beforeEach('create user', async function() {
      const apiCall = await models.Audit.ApiCall.create();
      await controllers.UserCtrl.signUp({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.user2.email,
        firstName: sampleData.users.user2.firstName,
        lastName: sampleData.users.user2.lastName,
        password: sampleData.users.user2.password,
      });
      trackChangesSpy.resetHistory();
    });

    it('should reject with the same email', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.UserCtrl.addUserToHousehold({
          auditApiCallUuid: apiCall.get('uuid'),
          email: sampleData.users.user2.email,
          firstName: sampleData.users.user2.firstName,
          lastName: sampleData.users.user2.lastName,
          password: sampleData.users.user2.password,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Email already exists');
        assert.isTrue(err instanceof UserError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should reject with the same email regardless of case', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.UserCtrl.addUserToHousehold({
          auditApiCallUuid: apiCall.get('uuid'),
          email: sampleData.users.user2.email.toUpperCase(),
          firstName: sampleData.users.user2.firstName,
          lastName: sampleData.users.user2.lastName,
          password: sampleData.users.user2.password,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Email already exists');
        assert.isTrue(err instanceof UserError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });
  });
});
