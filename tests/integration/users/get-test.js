import chai from 'chai';
import chaiHttp from 'chai-http';

import sampleData from '../../sample-data/index.js';
import TestHelper from '../../test-helper/index.js';

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /users', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1Token;
  let user1Uuid;
  let user2Uuid;
  let user3Uuid;
  let user4Uuid;
  let user5Uuid;
  let user6Uuid;
  let user7Uuid;
  let user8Uuid;
  let user9Uuid;
  let user10Uuid;
  let user11Uuid;
  let user12Uuid;
  let user13Uuid;
  let user14Uuid;
  let user15Uuid;
  let user16Uuid;
  let user17Uuid;
  let user18Uuid;
  let user19Uuid;
  let user20Uuid;
  let user21Uuid;
  let user22Uuid;
  let user23Uuid;
  let user24Uuid;
  let user25Uuid;
  let user26Uuid;
  let user27Uuid;
  let user28Token;
  let user28Uuid;

  // 18 Carmen Rose
  // 19 Carrie Sanders
  // 10 Chris Sudworth
  // 4 Cody Simonson
  // 22 Darrell Lewis
  // 6 Devon Speight
  // 14 Drew Reeves
  // 11 Duane Rice
  // 3 Freddie Sanford
  // 24 Hope Rose
  // 12 Jaco Mccoy
  // 20 Javier Barrett
  // 26 Jill Cook
  // 15 Joann Young
  // 9 Kerry Dickenson
  // 2 Lacey Walters
  // 1 Lindsay Rigby
  // 25 Lora Nichols
  // 21 Louise Green
  // 16 Luis Pena
  // 23 Lynn Mclaughlin
  // 17 Matthew Diaz
  // 8 Ollie Summers
  // 13 Patricia Fox
  // 7 Robbie Dickman
  // 27 Rodney Alvarado
  // 5 Sandy Gardener

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create user 1', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user1Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  before('create user 1 token', async function() {
    user1Token = await controllers.UserCtrl.getToken(user1Uuid);
  });

  before('create user 2', async function() {
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

  before('create user 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user3Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user3.email,
      firstName: sampleData.users.user3.firstName,
      lastName: sampleData.users.user3.lastName,
      password: sampleData.users.user3.password,
    });
  });

  before('create user 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user4Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user4.email,
      firstName: sampleData.users.user4.firstName,
      lastName: sampleData.users.user4.lastName,
      password: sampleData.users.user4.password,
    });
  });

  before('create user 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user5Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user5.email,
      firstName: sampleData.users.user5.firstName,
      lastName: sampleData.users.user5.lastName,
      password: sampleData.users.user5.password,
    });
  });

  before('create user 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user6Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user6.email,
      firstName: sampleData.users.user6.firstName,
      lastName: sampleData.users.user6.lastName,
      password: sampleData.users.user6.password,
    });
  });

  before('create user 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user7Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user7.email,
      firstName: sampleData.users.user7.firstName,
      lastName: sampleData.users.user7.lastName,
      password: sampleData.users.user7.password,
    });
  });

  before('create user 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user8Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user8.email,
      firstName: sampleData.users.user8.firstName,
      lastName: sampleData.users.user8.lastName,
      password: sampleData.users.user8.password,
    });
  });

  before('create user 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user9Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user9.email,
      firstName: sampleData.users.user9.firstName,
      lastName: sampleData.users.user9.lastName,
      password: sampleData.users.user9.password,
    });
  });

  before('create user 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user10Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user10.email,
      firstName: sampleData.users.user10.firstName,
      lastName: sampleData.users.user10.lastName,
      password: sampleData.users.user10.password,
    });
  });

  before('create user 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user11Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user11.email,
      firstName: sampleData.users.user11.firstName,
      lastName: sampleData.users.user11.lastName,
      password: sampleData.users.user11.password,
    });
  });

  before('create user 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user12Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user12.email,
      firstName: sampleData.users.user12.firstName,
      lastName: sampleData.users.user12.lastName,
      password: sampleData.users.user12.password,
    });
  });

  before('create user 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user13Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user13.email,
      firstName: sampleData.users.user13.firstName,
      lastName: sampleData.users.user13.lastName,
      password: sampleData.users.user13.password,
    });
  });

  before('create user 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user14Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user14.email,
      firstName: sampleData.users.user14.firstName,
      lastName: sampleData.users.user14.lastName,
      password: sampleData.users.user14.password,
    });
  });

  before('create user 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user15Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user15.email,
      firstName: sampleData.users.user15.firstName,
      lastName: sampleData.users.user15.lastName,
      password: sampleData.users.user15.password,
    });
  });

  before('create user 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user16Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user16.email,
      firstName: sampleData.users.user16.firstName,
      lastName: sampleData.users.user16.lastName,
      password: sampleData.users.user16.password,
    });
  });

  before('create user 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user17Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user17.email,
      firstName: sampleData.users.user17.firstName,
      lastName: sampleData.users.user17.lastName,
      password: sampleData.users.user17.password,
    });
  });

  before('create user 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user18Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user18.email,
      firstName: sampleData.users.user18.firstName,
      lastName: sampleData.users.user18.lastName,
      password: sampleData.users.user18.password,
    });
  });

  before('create user 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user19Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user19.email,
      firstName: sampleData.users.user19.firstName,
      lastName: sampleData.users.user19.lastName,
      password: sampleData.users.user19.password,
    });
  });

  before('create user 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user20Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user20.email,
      firstName: sampleData.users.user20.firstName,
      lastName: sampleData.users.user20.lastName,
      password: sampleData.users.user20.password,
    });
  });

  before('create user 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user21Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user21.email,
      firstName: sampleData.users.user21.firstName,
      lastName: sampleData.users.user21.lastName,
      password: sampleData.users.user21.password,
    });
  });

  before('create user 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user22Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user22.email,
      firstName: sampleData.users.user22.firstName,
      lastName: sampleData.users.user22.lastName,
      password: sampleData.users.user22.password,
    });
  });

  before('create user 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user23Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user23.email,
      firstName: sampleData.users.user23.firstName,
      lastName: sampleData.users.user23.lastName,
      password: sampleData.users.user23.password,
    });
  });

  before('create user 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user24Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user24.email,
      firstName: sampleData.users.user24.firstName,
      lastName: sampleData.users.user24.lastName,
      password: sampleData.users.user24.password,
    });
  });

  before('create user 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user25Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user25.email,
      firstName: sampleData.users.user25.firstName,
      lastName: sampleData.users.user25.lastName,
      password: sampleData.users.user25.password,
    });
  });

  before('create user 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user26Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user26.email,
      firstName: sampleData.users.user26.firstName,
      lastName: sampleData.users.user26.lastName,
      password: sampleData.users.user26.password,
    });
  });

  before('create user 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user27Uuid = await controllers.UserCtrl.addUserToHousehold({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user27.email,
      firstName: sampleData.users.user27.firstName,
      lastName: sampleData.users.user27.lastName,
      password: sampleData.users.user27.password,
    });
  });

  before('create user 28', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user28Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user28.email,
      firstName: sampleData.users.user28.firstName,
      lastName: sampleData.users.user28.lastName,
      password: sampleData.users.user28.password,
    });
  });

  before('create user 28 token', async function() {
    user28Token = await controllers.UserCtrl.getToken(user28Uuid);
  });

  after('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get('/users')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 200 and 25 users as user 1 with no limit or page specified', async function() {
    const res = await chai.request(server)
      .get('/users')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 25);

    // User 18
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(
      res.body.data[0].attributes.email,
      sampleData.users.user18.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[0].attributes['first-name'], sampleData.users.user18.firstName);
    assert.strictEqual(res.body.data[0].attributes['last-name'], sampleData.users.user18.lastName);
    assert.strictEqual(res.body.data[0].id, user18Uuid);
    assert.strictEqual(res.body.data[0].type, 'users');

    // User 19
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(
      res.body.data[1].attributes.email,
      sampleData.users.user19.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[1].attributes['first-name'], sampleData.users.user19.firstName);
    assert.strictEqual(res.body.data[1].attributes['last-name'], sampleData.users.user19.lastName);
    assert.strictEqual(res.body.data[1].id, user19Uuid);
    assert.strictEqual(res.body.data[1].type, 'users');

    // User 10
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(
      res.body.data[2].attributes.email,
      sampleData.users.user10.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[2].attributes['first-name'], sampleData.users.user10.firstName);
    assert.strictEqual(res.body.data[2].attributes['last-name'], sampleData.users.user10.lastName);
    assert.strictEqual(res.body.data[2].id, user10Uuid);
    assert.strictEqual(res.body.data[2].type, 'users');

    // User 4
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(
      res.body.data[3].attributes.email,
      sampleData.users.user4.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[3].attributes['first-name'], sampleData.users.user4.firstName);
    assert.strictEqual(res.body.data[3].attributes['last-name'], sampleData.users.user4.lastName);
    assert.strictEqual(res.body.data[3].id, user4Uuid);
    assert.strictEqual(res.body.data[3].type, 'users');

    // User 22
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(
      res.body.data[4].attributes.email,
      sampleData.users.user22.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[4].attributes['first-name'], sampleData.users.user22.firstName);
    assert.strictEqual(res.body.data[4].attributes['last-name'], sampleData.users.user22.lastName);
    assert.strictEqual(res.body.data[4].id, user22Uuid);
    assert.strictEqual(res.body.data[4].type, 'users');

    // User 6
    assert.isOk(res.body.data[5].attributes);
    assert.isOk(res.body.data[5].attributes['created-at']);
    assert.strictEqual(
      res.body.data[5].attributes.email,
      sampleData.users.user6.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[5].attributes['first-name'], sampleData.users.user6.firstName);
    assert.strictEqual(res.body.data[5].attributes['last-name'], sampleData.users.user6.lastName);
    assert.strictEqual(res.body.data[5].id, user6Uuid);
    assert.strictEqual(res.body.data[5].type, 'users');

    // User 14
    assert.isOk(res.body.data[6].attributes);
    assert.isOk(res.body.data[6].attributes['created-at']);
    assert.strictEqual(
      res.body.data[6].attributes.email,
      sampleData.users.user14.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[6].attributes['first-name'], sampleData.users.user14.firstName);
    assert.strictEqual(res.body.data[6].attributes['last-name'], sampleData.users.user14.lastName);
    assert.strictEqual(res.body.data[6].id, user14Uuid);
    assert.strictEqual(res.body.data[6].type, 'users');

    // User 11
    assert.isOk(res.body.data[7].attributes);
    assert.isOk(res.body.data[7].attributes['created-at']);
    assert.strictEqual(
      res.body.data[7].attributes.email,
      sampleData.users.user11.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[7].attributes['first-name'], sampleData.users.user11.firstName);
    assert.strictEqual(res.body.data[7].attributes['last-name'], sampleData.users.user11.lastName);
    assert.strictEqual(res.body.data[7].id, user11Uuid);
    assert.strictEqual(res.body.data[7].type, 'users');

    // User 3
    assert.isOk(res.body.data[8].attributes);
    assert.isOk(res.body.data[8].attributes['created-at']);
    assert.strictEqual(
      res.body.data[8].attributes.email,
      sampleData.users.user3.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[8].attributes['first-name'], sampleData.users.user3.firstName);
    assert.strictEqual(res.body.data[8].attributes['last-name'], sampleData.users.user3.lastName);
    assert.strictEqual(res.body.data[8].id, user3Uuid);
    assert.strictEqual(res.body.data[8].type, 'users');

    // User 24
    assert.isOk(res.body.data[9].attributes);
    assert.isOk(res.body.data[9].attributes['created-at']);
    assert.strictEqual(
      res.body.data[9].attributes.email,
      sampleData.users.user24.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[9].attributes['first-name'], sampleData.users.user24.firstName);
    assert.strictEqual(res.body.data[9].attributes['last-name'], sampleData.users.user24.lastName);
    assert.strictEqual(res.body.data[9].id, user24Uuid);
    assert.strictEqual(res.body.data[9].type, 'users');

    // User 12
    assert.isOk(res.body.data[10].attributes);
    assert.isOk(res.body.data[10].attributes['created-at']);
    assert.strictEqual(
      res.body.data[10].attributes.email,
      sampleData.users.user12.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[10].attributes['first-name'], sampleData.users.user12.firstName);
    assert.strictEqual(res.body.data[10].attributes['last-name'], sampleData.users.user12.lastName);
    assert.strictEqual(res.body.data[10].id, user12Uuid);
    assert.strictEqual(res.body.data[10].type, 'users');

    // User 20
    assert.isOk(res.body.data[11].attributes);
    assert.isOk(res.body.data[11].attributes['created-at']);
    assert.strictEqual(
      res.body.data[11].attributes.email,
      sampleData.users.user20.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[11].attributes['first-name'], sampleData.users.user20.firstName);
    assert.strictEqual(res.body.data[11].attributes['last-name'], sampleData.users.user20.lastName);
    assert.strictEqual(res.body.data[11].id, user20Uuid);
    assert.strictEqual(res.body.data[11].type, 'users');

    // User 26
    assert.isOk(res.body.data[12].attributes);
    assert.isOk(res.body.data[12].attributes['created-at']);
    assert.strictEqual(
      res.body.data[12].attributes.email,
      sampleData.users.user26.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[12].attributes['first-name'], sampleData.users.user26.firstName);
    assert.strictEqual(res.body.data[12].attributes['last-name'], sampleData.users.user26.lastName);
    assert.strictEqual(res.body.data[12].id, user26Uuid);
    assert.strictEqual(res.body.data[12].type, 'users');

    // User 15
    assert.isOk(res.body.data[13].attributes);
    assert.isOk(res.body.data[13].attributes['created-at']);
    assert.strictEqual(
      res.body.data[13].attributes.email,
      sampleData.users.user15.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[13].attributes['first-name'], sampleData.users.user15.firstName);
    assert.strictEqual(res.body.data[13].attributes['last-name'], sampleData.users.user15.lastName);
    assert.strictEqual(res.body.data[13].id, user15Uuid);
    assert.strictEqual(res.body.data[13].type, 'users');

    // User 9
    assert.isOk(res.body.data[14].attributes);
    assert.isOk(res.body.data[14].attributes['created-at']);
    assert.strictEqual(
      res.body.data[14].attributes.email,
      sampleData.users.user9.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[14].attributes['first-name'], sampleData.users.user9.firstName);
    assert.strictEqual(res.body.data[14].attributes['last-name'], sampleData.users.user9.lastName);
    assert.strictEqual(res.body.data[14].id, user9Uuid);
    assert.strictEqual(res.body.data[14].type, 'users');

    // User 2
    assert.isOk(res.body.data[15].attributes);
    assert.isOk(res.body.data[15].attributes['created-at']);
    assert.strictEqual(
      res.body.data[15].attributes.email,
      sampleData.users.user2.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[15].attributes['first-name'], sampleData.users.user2.firstName);
    assert.strictEqual(res.body.data[15].attributes['last-name'], sampleData.users.user2.lastName);
    assert.strictEqual(res.body.data[15].id, user2Uuid);
    assert.strictEqual(res.body.data[15].type, 'users');

    // User 1
    assert.isOk(res.body.data[16].attributes);
    assert.isOk(res.body.data[16].attributes['created-at']);
    assert.strictEqual(
      res.body.data[16].attributes.email,
      sampleData.users.user1.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[16].attributes['first-name'], sampleData.users.user1.firstName);
    assert.strictEqual(res.body.data[16].attributes['last-name'], sampleData.users.user1.lastName);
    assert.strictEqual(res.body.data[16].id, user1Uuid);
    assert.strictEqual(res.body.data[16].type, 'users');

    // User 25
    assert.isOk(res.body.data[17].attributes);
    assert.isOk(res.body.data[17].attributes['created-at']);
    assert.strictEqual(
      res.body.data[17].attributes.email,
      sampleData.users.user25.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[17].attributes['first-name'], sampleData.users.user25.firstName);
    assert.strictEqual(res.body.data[17].attributes['last-name'], sampleData.users.user25.lastName);
    assert.strictEqual(res.body.data[17].id, user25Uuid);
    assert.strictEqual(res.body.data[17].type, 'users');

    // User 21
    assert.isOk(res.body.data[18].attributes);
    assert.isOk(res.body.data[18].attributes['created-at']);
    assert.strictEqual(
      res.body.data[18].attributes.email,
      sampleData.users.user21.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[18].attributes['first-name'], sampleData.users.user21.firstName);
    assert.strictEqual(res.body.data[18].attributes['last-name'], sampleData.users.user21.lastName);
    assert.strictEqual(res.body.data[18].id, user21Uuid);
    assert.strictEqual(res.body.data[18].type, 'users');

    // User 16
    assert.isOk(res.body.data[19].attributes);
    assert.isOk(res.body.data[19].attributes['created-at']);
    assert.strictEqual(
      res.body.data[19].attributes.email,
      sampleData.users.user16.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[19].attributes['first-name'], sampleData.users.user16.firstName);
    assert.strictEqual(res.body.data[19].attributes['last-name'], sampleData.users.user16.lastName);
    assert.strictEqual(res.body.data[19].id, user16Uuid);
    assert.strictEqual(res.body.data[19].type, 'users');

    // User 23
    assert.isOk(res.body.data[20].attributes);
    assert.isOk(res.body.data[20].attributes['created-at']);
    assert.strictEqual(
      res.body.data[20].attributes.email,
      sampleData.users.user23.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[20].attributes['first-name'], sampleData.users.user23.firstName);
    assert.strictEqual(res.body.data[20].attributes['last-name'], sampleData.users.user23.lastName);
    assert.strictEqual(res.body.data[20].id, user23Uuid);
    assert.strictEqual(res.body.data[20].type, 'users');

    // User 17
    assert.isOk(res.body.data[21].attributes);
    assert.isOk(res.body.data[21].attributes['created-at']);
    assert.strictEqual(
      res.body.data[21].attributes.email,
      sampleData.users.user17.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[21].attributes['first-name'], sampleData.users.user17.firstName);
    assert.strictEqual(res.body.data[21].attributes['last-name'], sampleData.users.user17.lastName);
    assert.strictEqual(res.body.data[21].id, user17Uuid);
    assert.strictEqual(res.body.data[21].type, 'users');

    // User 8
    assert.isOk(res.body.data[22].attributes);
    assert.isOk(res.body.data[22].attributes['created-at']);
    assert.strictEqual(
      res.body.data[22].attributes.email,
      sampleData.users.user8.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[22].attributes['first-name'], sampleData.users.user8.firstName);
    assert.strictEqual(res.body.data[22].attributes['last-name'], sampleData.users.user8.lastName);
    assert.strictEqual(res.body.data[22].id, user8Uuid);
    assert.strictEqual(res.body.data[22].type, 'users');

    // User 13
    assert.isOk(res.body.data[23].attributes);
    assert.isOk(res.body.data[23].attributes['created-at']);
    assert.strictEqual(
      res.body.data[23].attributes.email,
      sampleData.users.user13.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[23].attributes['first-name'], sampleData.users.user13.firstName);
    assert.strictEqual(res.body.data[23].attributes['last-name'], sampleData.users.user13.lastName);
    assert.strictEqual(res.body.data[23].id, user13Uuid);
    assert.strictEqual(res.body.data[23].type, 'users');

    // User 7
    assert.isOk(res.body.data[24].attributes);
    assert.isOk(res.body.data[24].attributes['created-at']);
    assert.strictEqual(
      res.body.data[24].attributes.email,
      sampleData.users.user7.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[24].attributes['first-name'], sampleData.users.user7.firstName);
    assert.strictEqual(res.body.data[24].attributes['last-name'], sampleData.users.user7.lastName);
    assert.strictEqual(res.body.data[24].id, user7Uuid);
    assert.strictEqual(res.body.data[24].type, 'users');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 2 users as user 1 with no limit and page=2', async function() {
    const res = await chai.request(server)
      .get('/users?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 2);

    // User 27
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(
      res.body.data[0].attributes.email,
      sampleData.users.user27.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[0].attributes['first-name'], sampleData.users.user27.firstName);
    assert.strictEqual(res.body.data[0].attributes['last-name'], sampleData.users.user27.lastName);
    assert.strictEqual(res.body.data[0].id, user27Uuid);
    assert.strictEqual(res.body.data[0].type, 'users');

    // User 5
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(
      res.body.data[1].attributes.email,
      sampleData.users.user5.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[1].attributes['first-name'], sampleData.users.user5.firstName);
    assert.strictEqual(res.body.data[1].attributes['last-name'], sampleData.users.user5.lastName);
    assert.strictEqual(res.body.data[1].id, user5Uuid);
    assert.strictEqual(res.body.data[1].type, 'users');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 5 users as user 1 with limit=5 and page=4', async function() {
    const res = await chai.request(server)
      .get('/users?limit=5&page=4')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 5);

    // User 2
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(
      res.body.data[0].attributes.email,
      sampleData.users.user2.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[0].attributes['first-name'], sampleData.users.user2.firstName);
    assert.strictEqual(res.body.data[0].attributes['last-name'], sampleData.users.user2.lastName);
    assert.strictEqual(res.body.data[0].id, user2Uuid);
    assert.strictEqual(res.body.data[0].type, 'users');

    // User 1
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(
      res.body.data[1].attributes.email,
      sampleData.users.user1.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[1].attributes['first-name'], sampleData.users.user1.firstName);
    assert.strictEqual(res.body.data[1].attributes['last-name'], sampleData.users.user1.lastName);
    assert.strictEqual(res.body.data[1].id, user1Uuid);
    assert.strictEqual(res.body.data[1].type, 'users');

    // User 25
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(
      res.body.data[2].attributes.email,
      sampleData.users.user25.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[2].attributes['first-name'], sampleData.users.user25.firstName);
    assert.strictEqual(res.body.data[2].attributes['last-name'], sampleData.users.user25.lastName);
    assert.strictEqual(res.body.data[2].id, user25Uuid);
    assert.strictEqual(res.body.data[2].type, 'users');

    // User 21
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(
      res.body.data[3].attributes.email,
      sampleData.users.user21.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[3].attributes['first-name'], sampleData.users.user21.firstName);
    assert.strictEqual(res.body.data[3].attributes['last-name'], sampleData.users.user21.lastName);
    assert.strictEqual(res.body.data[3].id, user21Uuid);
    assert.strictEqual(res.body.data[3].type, 'users');

    // User 16
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(
      res.body.data[4].attributes.email,
      sampleData.users.user16.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[4].attributes['first-name'], sampleData.users.user16.firstName);
    assert.strictEqual(res.body.data[4].attributes['last-name'], sampleData.users.user16.lastName);
    assert.strictEqual(res.body.data[4].id, user16Uuid);
    assert.strictEqual(res.body.data[4].type, 'users');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 6);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 1 user as user 28', async function() {
    const res = await chai.request(server)
      .get('/users')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user28Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);

    // User 28
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(
      res.body.data[0].attributes.email,
      sampleData.users.user28.email.toLowerCase(),
    );
    assert.strictEqual(res.body.data[0].attributes['first-name'], sampleData.users.user28.firstName);
    assert.strictEqual(res.body.data[0].attributes['last-name'], sampleData.users.user28.lastName);
    assert.strictEqual(res.body.data[0].id, user28Uuid);
    assert.strictEqual(res.body.data[0].type, 'users');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  it('should return 200 and 0 users as user 2 with page=2', async function() {
    const res = await chai.request(server)
      .get('/users?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user28Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 0);
    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });
});
