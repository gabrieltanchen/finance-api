const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /attachments', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createAttachmentSpy;

  let expenseUuid;
  let householdMemberUuid;
  let subcategoryUuid;
  let userToken;
  let userUuid;
  let vendorUuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    createAttachmentSpy = sinon.spy(controllers.AttachmentCtrl, 'createAttachment');
  });

  after('restore sinon spies', function() {
    createAttachmentSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    userUuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  beforeEach('create user token', async function() {
    userToken = await controllers.UserCtrl.getToken(userUuid);
  });

  beforeEach('create subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    subcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category2.name,
    });
  });

  beforeEach('create vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    vendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  beforeEach('create household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    householdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  beforeEach('create expense', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    expenseUuid = await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      householdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid,
      vendorUuid,
    });
  });

  afterEach('reset history for sinon spies', function() {
    createAttachmentSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/attachments')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'name': sampleData.attachments.attachment1.name,
          },
          'relationships': {
            'expense': {
              'data': {
                'id': expenseUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(createAttachmentSpy.callCount, 0);
  });

  it('should return 422 with no name', async function() {
    const res = await chai.request(server)
      .post('/attachments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'name': null,
          },
          'relationships': {
            'expense': {
              'data': {
                'id': expenseUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Attachment name is required.',
        source: {
          pointer: '/data/attributes/name',
        },
      }],
    });
    assert.strictEqual(createAttachmentSpy.callCount, 0);
  });

  it('should return 422 with no expense uuid', async function() {
    const res = await chai.request(server)
      .post('/attachments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.attachments.attachment1.name,
          },
          'relationships': {
            'expense': {
              'data': {
                'id': null,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Expense is required.',
        source: {
          pointer: '/data/relationships/expense/data/id',
        },
      }],
    });
    assert.strictEqual(createAttachmentSpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/attachments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.attachments.attachment1.name,
          },
          'relationships': {
            'expense': {
              'data': {
                'id': expenseUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.attachments.attachment1.name);
    assert.isOk(res.body.data.id);
    assert.strictEqual(res.body.data.type, 'attachments');

    // Validate AttachmentCtrl.createAttachment call.
    assert.strictEqual(createAttachmentSpy.callCount, 1);
    const createAttachmentParams = createAttachmentSpy.getCall(0).args[0];
    assert.isOk(createAttachmentParams.auditApiCallUuid);
    assert.strictEqual(createAttachmentParams.expenseUuid, expenseUuid);
    assert.strictEqual(createAttachmentParams.name, sampleData.attachments.attachment1.name);

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
        uuid: createAttachmentParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/attachments');
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), userUuid);
  });
});
