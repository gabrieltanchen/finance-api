const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const sinon = require('sinon');

const sampleData = require('../../../../sample-data');
const TestHelper = require('../../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /attachments/:uuid/upload', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let s3ClientSendStub;
  let uploadAttachmentSpy;

  let user1AttachmentUuid;
  let user1ExpenseUuid;
  let user1HouseholdMemberUuid;
  let user1SubcategoryUuid;
  let user1Token;
  let user1Uuid;
  let user1VendorUuid;
  let user2Token;
  let user2Uuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    uploadAttachmentSpy = sinon.spy(controllers.AttachmentCtrl, 'uploadAttachment');
    s3ClientSendStub = sinon.stub(controllers.AttachmentCtrl.s3Client, 'send');
  });

  after('restore sinon spies', function() {
    uploadAttachmentSpy.restore();
    s3ClientSendStub.restore();
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

  beforeEach('create user 1 subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    user1SubcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category2.name,
    });
  });

  beforeEach('create user 1 vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1VendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  beforeEach('create user 1 household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  beforeEach('create user 1 expense', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1ExpenseUuid = await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1SubcategoryUuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 attachment', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1AttachmentUuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1ExpenseUuid,
      name: sampleData.attachments.attachment1.name,
    });
  });

  beforeEach('create user 2', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user2Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      password: sampleData.users.user2.password,
    });
  });

  beforeEach('create user 2 token', async function() {
    user2Token = await controllers.UserCtrl.getToken(user2Uuid);
  });

  afterEach('reset history for sinon spies', function() {
    uploadAttachmentSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post(`/attachments/${user1AttachmentUuid}/upload`)
      .set('Content-Type', 'application/vnd.api+json')
      .attach('file', fs.readFileSync('tests/sample-data/sample.pdf'), 'sample.pdf');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(uploadAttachmentSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .post(`/attachments/${user1AttachmentUuid}/upload`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .attach('file', fs.readFileSync('tests/sample-data/sample.pdf'), 'sample.pdf');
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find attachment.',
      }],
    });

    assert.strictEqual(uploadAttachmentSpy.callCount, 1);
    const uploadAttachmentParams = uploadAttachmentSpy.getCall(0).args[0];
    assert.strictEqual(uploadAttachmentParams.attachmentUuid, user1AttachmentUuid);
    assert.isOk(uploadAttachmentParams.auditApiCallUuid);
    assert.isOk(uploadAttachmentParams.fileBody);
    assert.strictEqual(uploadAttachmentParams.fileName, 'sample.pdf');
  });

  it('should return 204 with the correct auth token', async function() {
    s3ClientSendStub.resolves({
      ContentLength: sampleData.attachments.attachment1.aws_content_length,
      ContentType: sampleData.attachments.attachment1.aws_content_type,
      ETag: sampleData.attachments.attachment1.aws_etag,
    });

    const res = await chai.request(server)
      .post(`/attachments/${user1AttachmentUuid}/upload`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .attach('file', fs.readFileSync('tests/sample-data/sample.pdf'), 'sample.pdf');
    expect(res).to.have.status(204);

    // Validate AttachmentCtrl.uploadAttachment call.
    assert.strictEqual(uploadAttachmentSpy.callCount, 1);
    const uploadAttachmentParams = uploadAttachmentSpy.getCall(0).args[0];
    assert.strictEqual(uploadAttachmentParams.attachmentUuid, user1AttachmentUuid);
    assert.isOk(uploadAttachmentParams.auditApiCallUuid);
    assert.isOk(uploadAttachmentParams.fileBody);
    assert.strictEqual(uploadAttachmentParams.fileName, 'sample.pdf');

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
        uuid: uploadAttachmentParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/attachments/${user1AttachmentUuid}/upload`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
