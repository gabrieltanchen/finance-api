const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /users/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateUserDetailsSpy;

  let user1Token;
  let user1Uuid;
  let user2Uuid;
  let user3Token;
  let user3Uuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    updateUserDetailsSpy = sinon.spy(controllers.UserCtrl, 'updateUserDetails');
  });

  after('restore sinon spies', function() {
    updateUserDetailsSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user 1', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user1Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  beforeEach('create user 1 token', async function() {
    user1Token = await controllers.UserCtrl.getToken(user1Uuid);
  });

  beforeEach('create user 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user2Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      password: sampleData.users.user2.password,
    });
  });

  beforeEach('create user 3', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user3Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user3.email,
      firstName: sampleData.users.user3.firstName,
      lastName: sampleData.users.user3.lastName,
      password: sampleData.users.user3.password,
    });
  });

  beforeEach('create user 3 token', async function() {
    user3Token = await controllers.UserCtrl.getToken(user3Uuid);
  });

  afterEach('reset history for sinon spies', function() {
    updateUserDetailsSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/users/${user2Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'email': sampleData.users.user4.email,
            'first-name': sampleData.users.user4.firstName,
            'last-name': sampleData.users.user4.lastName,
          },
          'id': user2Uuid,
          'type': 'users',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(updateUserDetailsSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/users/${user2Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user3Token}`)
      .send({
        'data': {
          'attributes': {
            'email': sampleData.users.user4.email,
            'first-name': sampleData.users.user4.firstName,
            'last-name': sampleData.users.user4.lastName,
          },
          'id': user2Uuid,
          'type': 'users',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find user.',
      }],
    });
    assert.strictEqual(updateUserDetailsSpy.callCount, 1);
    const updateUserDetailsParams = updateUserDetailsSpy.getCall(0).args[0];
    assert.isOk(updateUserDetailsParams.auditApiCallUuid);
    assert.strictEqual(updateUserDetailsParams.email, sampleData.users.user4.email);
    assert.strictEqual(updateUserDetailsParams.firstName, sampleData.users.user4.firstName);
    assert.strictEqual(updateUserDetailsParams.lastName, sampleData.users.user4.lastName);
    assert.strictEqual(updateUserDetailsParams.userUuid, user2Uuid);
  });

  it('should return 422 with no email', async function() {
    const res = await chai.request(server)
      .patch(`/users/${user2Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'email': '',
            'first-name': sampleData.users.user4.firstName,
            'last-name': sampleData.users.user4.lastName,
          },
          'id': user2Uuid,
          'type': 'users',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Email address is required.',
        source: {
          pointer: '/data/attributes/email',
        },
      }, {
        detail: 'Please enter a valid email address.',
        source: {
          pointer: '/data/attributes/email',
        },
      }],
    });
    assert.strictEqual(updateUserDetailsSpy.callCount, 0);
  });

  it('should return 422 with an invalid email', async function() {
    const res = await chai.request(server)
      .patch(`/users/${user2Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'email': sampleData.users.invalid5.email,
            'first-name': sampleData.users.user4.firstName,
            'last-name': sampleData.users.user4.lastName,
          },
          'id': user2Uuid,
          'type': 'users',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Please enter a valid email address.',
        source: {
          pointer: '/data/attributes/email',
        },
      }],
    });
    assert.strictEqual(updateUserDetailsSpy.callCount, 0);
  });

  it('should return 422 with no first name', async function() {
    const res = await chai.request(server)
      .patch(`/users/${user2Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'email': sampleData.users.user4.email,
            'first-name': '',
            'last-name': sampleData.users.user4.lastName,
          },
          'id': user2Uuid,
          'type': 'users',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'First name is required.',
        source: {
          pointer: '/data/attributes/first-name',
        },
      }],
    });
    assert.strictEqual(updateUserDetailsSpy.callCount, 0);
  });

  it('should return 422 with no last name', async function() {
    const res = await chai.request(server)
      .patch(`/users/${user2Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'email': sampleData.users.user4.email,
            'first-name': sampleData.users.user4.firstName,
            'last-name': '',
          },
          'id': user2Uuid,
          'type': 'users',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Last name is required.',
        source: {
          pointer: '/data/attributes/last-name',
        },
      }],
    });
    assert.strictEqual(updateUserDetailsSpy.callCount, 0);
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/users/${user2Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'email': sampleData.users.user4.email,
            'first-name': sampleData.users.user4.firstName,
            'last-name': sampleData.users.user4.lastName,
          },
          'id': user2Uuid,
          'type': 'users',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.email, sampleData.users.user4.email.toLowerCase());
    assert.strictEqual(res.body.data.attributes['first-name'], sampleData.users.user4.firstName);
    assert.strictEqual(res.body.data.attributes['last-name'], sampleData.users.user4.lastName);
    assert.strictEqual(res.body.data.id, user2Uuid);
    assert.strictEqual(res.body.data.type, 'users');

    // Validate UserCtrl.updateUserDetails call.
    assert.strictEqual(updateUserDetailsSpy.callCount, 1);
    const updateUserDetailsParams = updateUserDetailsSpy.getCall(0).args[0];
    assert.isOk(updateUserDetailsParams.auditApiCallUuid);
    assert.strictEqual(updateUserDetailsParams.email, sampleData.users.user4.email);
    assert.strictEqual(updateUserDetailsParams.firstName, sampleData.users.user4.firstName);
    assert.strictEqual(updateUserDetailsParams.lastName, sampleData.users.user4.lastName);
    assert.strictEqual(updateUserDetailsParams.userUuid, user2Uuid);

    // Validate Audit API call.
    const apiCall = await models.Audit.ApiCall.findOne({
      attributes: [
        'http_method',
        'ip_address',
        'route',
        'user_agent',
        'user_uuid',
        'uuid',
      ],
      where: {
        uuid: updateUserDetailsParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/users/${user2Uuid}`);
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
