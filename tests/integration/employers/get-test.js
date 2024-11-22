import chai from 'chai';
import chaiHttp from 'chai-http';

import sampleData from '../../sample-data/index.js';
import TestHelper from '../../test-helper/index.js';

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /employers', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1Employer1Uuid;
  let user1Employer2Uuid;
  let user1Employer3Uuid;
  let user1Employer4Uuid;
  let user1Employer5Uuid;
  let user1Employer6Uuid;
  let user1Employer7Uuid;
  let user1Employer8Uuid;
  let user1Employer9Uuid;
  let user1Employer10Uuid;
  let user1Employer11Uuid;
  let user1Employer12Uuid;
  let user1Employer13Uuid;
  let user1Employer14Uuid;
  let user1Employer15Uuid;
  let user1Employer16Uuid;
  let user1Employer17Uuid;
  let user1Employer18Uuid;
  let user1Employer19Uuid;
  let user1Employer20Uuid;
  let user1Employer21Uuid;
  let user1Employer22Uuid;
  let user1Employer23Uuid;
  let user1Employer24Uuid;
  let user1Employer25Uuid;
  let user1Employer26Uuid;
  let user1Employer27Uuid;
  let user1Token;
  let user1Uuid;
  let user2EmployerUuid;
  let user2Token;
  let user2Uuid;

  // 27 Bacon & Fern
  // 13 Barrow & Grape
  // 15 Blossom & Aunt
  // 12 Book & Parsley
  // 17 Bourbon & Chain
  // 26 Brush & Beacon
  // 10 Cheddar & Knob
  // 2 Chick & Mushroom
  // 23 Compass & Mole
  // 6 Death & Colonel
  // 22 Death & Hazel
  // 4 Dove & Barber
  // 21 Drum & Painter
  // 25 Grape & Summer
  // 11 Jackal & Block
  // 3 Jacket & Lunch
  // 7 Lion & Coast
  // 16 Marlin & Brick
  // 1 Marrow & Chick
  // 19 Mole & Minnow
  // 5 Order & Thorn
  // 24 Sandstone & Loon
  // 18 Satin & Cheese
  // 20 Shovel & Wrench
  // 9 Tower & Stamp
  // 8 Winter & Nest
  // 14 Yarn & Serif

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

  before('create user 1 employer 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer1Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer1.name,
    });
  });

  before('create user 1 employer 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer2Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer2.name,
    });
  });

  before('create user 1 employer 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer3Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer3.name,
    });
  });

  before('create user 1 employer 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer4Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer4.name,
    });
  });

  before('create user 1 employer 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer5Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer5.name,
    });
  });

  before('create user 1 employer 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer6Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer6.name,
    });
  });

  before('create user 1 employer 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer7Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer7.name,
    });
  });

  before('create user 1 employer 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer8Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer8.name,
    });
  });

  before('create user 1 employer 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer9Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer9.name,
    });
  });

  before('create user 1 employer 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer10Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer10.name,
    });
  });

  before('create user 1 employer 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer11Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer11.name,
    });
  });

  before('create user 1 employer 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer12Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer12.name,
    });
  });

  before('create user 1 employer 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer13Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer13.name,
    });
  });

  before('create user 1 employer 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer14Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer14.name,
    });
  });

  before('create user 1 employer 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer15Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer15.name,
    });
  });

  before('create user 1 employer 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer16Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer16.name,
    });
  });

  before('create user 1 employer 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer17Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer17.name,
    });
  });

  before('create user 1 employer 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer18Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer18.name,
    });
  });

  before('create user 1 employer 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer19Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer19.name,
    });
  });

  before('create user 1 employer 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer20Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer20.name,
    });
  });

  before('create user 1 employer 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer21Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer21.name,
    });
  });

  before('create user 1 employer 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer22Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer22.name,
    });
  });

  before('create user 1 employer 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer23Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer23.name,
    });
  });

  before('create user 1 employer 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer24Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer24.name,
    });
  });

  before('create user 1 employer 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer25Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer25.name,
    });
  });

  before('create user 1 employer 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer26Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer26.name,
    });
  });

  before('create user 1 employer 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Employer27Uuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer27.name,
    });
  });

  before('create user 2', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user2Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      password: sampleData.users.user2.password,
    });
  });

  before('create user 2 token', async function() {
    user2Token = await controllers.UserCtrl.getToken(user2Uuid);
  });

  before('create user 2 employer', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2EmployerUuid = await controllers.EmployerCtrl.createEmployer({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.employers.employer28.name,
    });
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
      .get('/employers')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 200 and 25 employers as user 1 with no limit or page specified', async function() {
    const res = await chai.request(server)
      .get('/employers')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 25);

    // Employer 27
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.employers.employer27.name);
    assert.strictEqual(res.body.data[0].id, user1Employer27Uuid);
    assert.strictEqual(res.body.data[0].type, 'employers');

    // Employer 13
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.employers.employer13.name);
    assert.strictEqual(res.body.data[1].id, user1Employer13Uuid);
    assert.strictEqual(res.body.data[1].type, 'employers');

    // Employer 15
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.employers.employer15.name);
    assert.strictEqual(res.body.data[2].id, user1Employer15Uuid);
    assert.strictEqual(res.body.data[2].type, 'employers');

    // Employer 12
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.employers.employer12.name);
    assert.strictEqual(res.body.data[3].id, user1Employer12Uuid);
    assert.strictEqual(res.body.data[3].type, 'employers');

    // Employer 17
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.employers.employer17.name);
    assert.strictEqual(res.body.data[4].id, user1Employer17Uuid);
    assert.strictEqual(res.body.data[4].type, 'employers');

    // Employer 26
    assert.isOk(res.body.data[5].attributes);
    assert.isOk(res.body.data[5].attributes['created-at']);
    assert.strictEqual(res.body.data[5].attributes.name, sampleData.employers.employer26.name);
    assert.strictEqual(res.body.data[5].id, user1Employer26Uuid);
    assert.strictEqual(res.body.data[5].type, 'employers');

    // Employer 10
    assert.isOk(res.body.data[6].attributes);
    assert.isOk(res.body.data[6].attributes['created-at']);
    assert.strictEqual(res.body.data[6].attributes.name, sampleData.employers.employer10.name);
    assert.strictEqual(res.body.data[6].id, user1Employer10Uuid);
    assert.strictEqual(res.body.data[6].type, 'employers');

    // Employer 2
    assert.isOk(res.body.data[7].attributes);
    assert.isOk(res.body.data[7].attributes['created-at']);
    assert.strictEqual(res.body.data[7].attributes.name, sampleData.employers.employer2.name);
    assert.strictEqual(res.body.data[7].id, user1Employer2Uuid);
    assert.strictEqual(res.body.data[7].type, 'employers');

    // Employer 23
    assert.isOk(res.body.data[8].attributes);
    assert.isOk(res.body.data[8].attributes['created-at']);
    assert.strictEqual(res.body.data[8].attributes.name, sampleData.employers.employer23.name);
    assert.strictEqual(res.body.data[8].id, user1Employer23Uuid);
    assert.strictEqual(res.body.data[8].type, 'employers');

    // Employer 6
    assert.isOk(res.body.data[9].attributes);
    assert.isOk(res.body.data[9].attributes['created-at']);
    assert.strictEqual(res.body.data[9].attributes.name, sampleData.employers.employer6.name);
    assert.strictEqual(res.body.data[9].id, user1Employer6Uuid);
    assert.strictEqual(res.body.data[9].type, 'employers');

    // Employer 22
    assert.isOk(res.body.data[10].attributes);
    assert.isOk(res.body.data[10].attributes['created-at']);
    assert.strictEqual(res.body.data[10].attributes.name, sampleData.employers.employer22.name);
    assert.strictEqual(res.body.data[10].id, user1Employer22Uuid);
    assert.strictEqual(res.body.data[10].type, 'employers');

    // Employer 4
    assert.isOk(res.body.data[11].attributes);
    assert.isOk(res.body.data[11].attributes['created-at']);
    assert.strictEqual(res.body.data[11].attributes.name, sampleData.employers.employer4.name);
    assert.strictEqual(res.body.data[11].id, user1Employer4Uuid);
    assert.strictEqual(res.body.data[11].type, 'employers');

    // Employer 21
    assert.isOk(res.body.data[12].attributes);
    assert.isOk(res.body.data[12].attributes['created-at']);
    assert.strictEqual(res.body.data[12].attributes.name, sampleData.employers.employer21.name);
    assert.strictEqual(res.body.data[12].id, user1Employer21Uuid);
    assert.strictEqual(res.body.data[12].type, 'employers');

    // Employer 25
    assert.isOk(res.body.data[13].attributes);
    assert.isOk(res.body.data[13].attributes['created-at']);
    assert.strictEqual(res.body.data[13].attributes.name, sampleData.employers.employer25.name);
    assert.strictEqual(res.body.data[13].id, user1Employer25Uuid);
    assert.strictEqual(res.body.data[13].type, 'employers');

    // Employer 11
    assert.isOk(res.body.data[14].attributes);
    assert.isOk(res.body.data[14].attributes['created-at']);
    assert.strictEqual(res.body.data[14].attributes.name, sampleData.employers.employer11.name);
    assert.strictEqual(res.body.data[14].id, user1Employer11Uuid);
    assert.strictEqual(res.body.data[14].type, 'employers');

    // Employer 3
    assert.isOk(res.body.data[15].attributes);
    assert.isOk(res.body.data[15].attributes['created-at']);
    assert.strictEqual(res.body.data[15].attributes.name, sampleData.employers.employer3.name);
    assert.strictEqual(res.body.data[15].id, user1Employer3Uuid);
    assert.strictEqual(res.body.data[15].type, 'employers');

    // Employer 7
    assert.isOk(res.body.data[16].attributes);
    assert.isOk(res.body.data[16].attributes['created-at']);
    assert.strictEqual(res.body.data[16].attributes.name, sampleData.employers.employer7.name);
    assert.strictEqual(res.body.data[16].id, user1Employer7Uuid);
    assert.strictEqual(res.body.data[16].type, 'employers');

    // Employer 16
    assert.isOk(res.body.data[17].attributes);
    assert.isOk(res.body.data[17].attributes['created-at']);
    assert.strictEqual(res.body.data[17].attributes.name, sampleData.employers.employer16.name);
    assert.strictEqual(res.body.data[17].id, user1Employer16Uuid);
    assert.strictEqual(res.body.data[17].type, 'employers');

    // Employer 1
    assert.isOk(res.body.data[18].attributes);
    assert.isOk(res.body.data[18].attributes['created-at']);
    assert.strictEqual(res.body.data[18].attributes.name, sampleData.employers.employer1.name);
    assert.strictEqual(res.body.data[18].id, user1Employer1Uuid);
    assert.strictEqual(res.body.data[18].type, 'employers');

    // Employer 19
    assert.isOk(res.body.data[19].attributes);
    assert.isOk(res.body.data[19].attributes['created-at']);
    assert.strictEqual(res.body.data[19].attributes.name, sampleData.employers.employer19.name);
    assert.strictEqual(res.body.data[19].id, user1Employer19Uuid);
    assert.strictEqual(res.body.data[19].type, 'employers');

    // Employer 5
    assert.isOk(res.body.data[20].attributes);
    assert.isOk(res.body.data[20].attributes['created-at']);
    assert.strictEqual(res.body.data[20].attributes.name, sampleData.employers.employer5.name);
    assert.strictEqual(res.body.data[20].id, user1Employer5Uuid);
    assert.strictEqual(res.body.data[20].type, 'employers');

    // Employer 24
    assert.isOk(res.body.data[21].attributes);
    assert.isOk(res.body.data[21].attributes['created-at']);
    assert.strictEqual(res.body.data[21].attributes.name, sampleData.employers.employer24.name);
    assert.strictEqual(res.body.data[21].id, user1Employer24Uuid);
    assert.strictEqual(res.body.data[21].type, 'employers');

    // Employer 18
    assert.isOk(res.body.data[22].attributes);
    assert.isOk(res.body.data[22].attributes['created-at']);
    assert.strictEqual(res.body.data[22].attributes.name, sampleData.employers.employer18.name);
    assert.strictEqual(res.body.data[22].id, user1Employer18Uuid);
    assert.strictEqual(res.body.data[22].type, 'employers');

    // Employer 20
    assert.isOk(res.body.data[23].attributes);
    assert.isOk(res.body.data[23].attributes['created-at']);
    assert.strictEqual(res.body.data[23].attributes.name, sampleData.employers.employer20.name);
    assert.strictEqual(res.body.data[23].id, user1Employer20Uuid);
    assert.strictEqual(res.body.data[23].type, 'employers');

    // Employer 9
    assert.isOk(res.body.data[24].attributes);
    assert.isOk(res.body.data[24].attributes['created-at']);
    assert.strictEqual(res.body.data[24].attributes.name, sampleData.employers.employer9.name);
    assert.strictEqual(res.body.data[24].id, user1Employer9Uuid);
    assert.strictEqual(res.body.data[24].type, 'employers');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 2 employers as user 1 with no limit and page=2', async function() {
    const res = await chai.request(server)
      .get('/employers?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 2);

    // Employer 8
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.employers.employer8.name);
    assert.strictEqual(res.body.data[0].id, user1Employer8Uuid);
    assert.strictEqual(res.body.data[0].type, 'employers');

    // Employer 14
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.employers.employer14.name);
    assert.strictEqual(res.body.data[1].id, user1Employer14Uuid);
    assert.strictEqual(res.body.data[1].type, 'employers');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 5 employers as user 1 with limit=5 and page=4', async function() {
    const res = await chai.request(server)
      .get('/employers?limit=5&page=4')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 5);

    // Employer 3
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.employers.employer3.name);
    assert.strictEqual(res.body.data[0].id, user1Employer3Uuid);
    assert.strictEqual(res.body.data[0].type, 'employers');

    // Employer 7
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.employers.employer7.name);
    assert.strictEqual(res.body.data[1].id, user1Employer7Uuid);
    assert.strictEqual(res.body.data[1].type, 'employers');

    // Employer 16
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.employers.employer16.name);
    assert.strictEqual(res.body.data[2].id, user1Employer16Uuid);
    assert.strictEqual(res.body.data[2].type, 'employers');

    // Employer 1
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.employers.employer1.name);
    assert.strictEqual(res.body.data[3].id, user1Employer1Uuid);
    assert.strictEqual(res.body.data[3].type, 'employers');

    // Employer 19
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.employers.employer19.name);
    assert.strictEqual(res.body.data[4].id, user1Employer19Uuid);
    assert.strictEqual(res.body.data[4].type, 'employers');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 6);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 1 employer as user 2', async function() {
    const res = await chai.request(server)
      .get('/employers')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);

    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.employers.employer28.name);
    assert.strictEqual(res.body.data[0].id, user2EmployerUuid);
    assert.strictEqual(res.body.data[0].type, 'employers');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  it('should return 200 and 0 employers as user 2 with page=2', async function() {
    const res = await chai.request(server)
      .get('/employers?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 0);
    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });
});
