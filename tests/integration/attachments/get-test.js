const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /attachments', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1Attachment1Uuid;
  let user1Attachment2Uuid;
  let user1Attachment3Uuid;
  let user1Attachment4Uuid;
  let user1Attachment5Uuid;
  let user1Attachment6Uuid;
  let user1Attachment7Uuid;
  let user1Attachment8Uuid;
  let user1Attachment9Uuid;
  let user1Attachment10Uuid;
  let user1Attachment11Uuid;
  let user1Attachment12Uuid;
  let user1Attachment13Uuid;
  let user1Attachment14Uuid;
  let user1Attachment15Uuid;
  let user1Attachment16Uuid;
  let user1Attachment17Uuid;
  let user1Attachment18Uuid;
  let user1Attachment19Uuid;
  let user1Attachment20Uuid;
  let user1Attachment21Uuid;
  let user1Attachment22Uuid;
  let user1Attachment23Uuid;
  let user1Attachment24Uuid;
  let user1Attachment25Uuid;
  let user1Attachment26Uuid;
  let user1Attachment27Uuid;
  let user1Attachment28Uuid;
  let user1Expense1Uuid;
  let user1Expense2Uuid;
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

  before('create user 1 subcategory', async function() {
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

  before('create user 1 vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1VendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  before('create user 1 household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  before('create user 1 expense 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Expense1Uuid = await controllers.ExpenseCtrl.createExpense({
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

  before('create user 1 expense 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Expense2Uuid = await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense2.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
      subcategoryUuid: user1SubcategoryUuid,
      vendorUuid: user1VendorUuid,
    });
  });

  before('create user 1 attachment 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment1Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment1.name,
    });
  });

  before('create user 1 attachment 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment2Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment2.name,
    });
  });

  before('create user 1 attachment 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment3Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment3.name,
    });
  });

  before('create user 1 attachment 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment4Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment4.name,
    });
  });

  before('create user 1 attachment 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment5Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment5.name,
    });
  });

  before('create user 1 attachment 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment6Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment6.name,
    });
  });

  before('create user 1 attachment 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment7Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment7.name,
    });
  });

  before('create user 1 attachment 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment8Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment8.name,
    });
  });

  before('create user 1 attachment 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment9Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment9.name,
    });
  });

  before('create user 1 attachment 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment10Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment10.name,
    });
  });

  before('create user 1 attachment 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment11Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment11.name,
    });
  });

  before('create user 1 attachment 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment12Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment12.name,
    });
  });

  before('create user 1 attachment 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment13Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment13.name,
    });
  });

  before('create user 1 attachment 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment14Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment14.name,
    });
  });

  before('create user 1 attachment 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment15Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment15.name,
    });
  });

  before('create user 1 attachment 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment16Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment16.name,
    });
  });

  before('create user 1 attachment 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment17Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment17.name,
    });
  });

  before('create user 1 attachment 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment18Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment18.name,
    });
  });

  before('create user 1 attachment 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment19Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment19.name,
    });
  });

  before('create user 1 attachment 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment20Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment20.name,
    });
  });

  before('create user 1 attachment 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment21Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment21.name,
    });
  });

  before('create user 1 attachment 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment22Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment22.name,
    });
  });

  before('create user 1 attachment 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment23Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment23.name,
    });
  });

  before('create user 1 attachment 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment24Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment24.name,
    });
  });

  before('create user 1 attachment 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment25Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment25.name,
    });
  });

  before('create user 1 attachment 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment26Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment26.name,
    });
  });

  before('create user 1 attachment 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment27Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment27.name,
    });
  });

  before('create user 1 attachment 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Attachment28Uuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense2Uuid,
      name: sampleData.attachments.attachment28.name,
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

  after('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get('/attachments')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 403 with no expense id', async function() {
    const res = await chai.request(server)
      .get('/attachments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(403);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Expense ID is required.',
      }],
    });
  });

  describe('when called with the expense_id query param', function() {
    it('should return 404 when the expense does not exist', async function() {
      const res = await chai.request(server)
        .get(`/attachments?expense_id=${uuidv4()}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find expense.',
        }],
      });
    });

    it('should return 404 when the expense belongs to a different household', async function() {
      const res = await chai.request(server)
        .get(`/attachments?expense_id=${user1Expense1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find expense.',
        }],
      });
    });

    it('should return 200 and 25 attachments as user 1 with expense 1 and no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/attachments?expense_id=${user1Expense1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Attachment 19
      assert.isOk(res.body.data[0].attributes);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(
        res.body.data[0].attributes.name,
        sampleData.attachments.attachment19.name,
      );
      assert.strictEqual(res.body.data[0].id, user1Attachment19Uuid);
      assert.strictEqual(res.body.data[0].type, 'attachments');

      // Attachment 16
      assert.isOk(res.body.data[1].attributes);
      assert.isOk(res.body.data[1].attributes['created-at']);
      assert.strictEqual(
        res.body.data[1].attributes.name,
        sampleData.attachments.attachment16.name,
      );
      assert.strictEqual(res.body.data[1].id, user1Attachment16Uuid);
      assert.strictEqual(res.body.data[1].type, 'attachments');

      // Attachment 1
      assert.isOk(res.body.data[2].attributes);
      assert.isOk(res.body.data[2].attributes['created-at']);
      assert.strictEqual(
        res.body.data[2].attributes.name,
        sampleData.attachments.attachment1.name,
      );
      assert.strictEqual(res.body.data[2].id, user1Attachment1Uuid);
      assert.strictEqual(res.body.data[2].type, 'attachments');

      // Attachment 22
      assert.isOk(res.body.data[3].attributes);
      assert.isOk(res.body.data[3].attributes['created-at']);
      assert.strictEqual(
        res.body.data[3].attributes.name,
        sampleData.attachments.attachment22.name,
      );
      assert.strictEqual(res.body.data[3].id, user1Attachment22Uuid);
      assert.strictEqual(res.body.data[3].type, 'attachments');

      // Attachment 14
      assert.isOk(res.body.data[4].attributes);
      assert.isOk(res.body.data[4].attributes['created-at']);
      assert.strictEqual(
        res.body.data[4].attributes.name,
        sampleData.attachments.attachment14.name,
      );
      assert.strictEqual(res.body.data[4].id, user1Attachment14Uuid);
      assert.strictEqual(res.body.data[4].type, 'attachments');

      // Attachment 18
      assert.isOk(res.body.data[5].attributes);
      assert.isOk(res.body.data[5].attributes['created-at']);
      assert.strictEqual(
        res.body.data[5].attributes.name,
        sampleData.attachments.attachment18.name,
      );
      assert.strictEqual(res.body.data[5].id, user1Attachment18Uuid);
      assert.strictEqual(res.body.data[5].type, 'attachments');

      // Attachment 7
      assert.isOk(res.body.data[6].attributes);
      assert.isOk(res.body.data[6].attributes['created-at']);
      assert.strictEqual(
        res.body.data[6].attributes.name,
        sampleData.attachments.attachment7.name,
      );
      assert.strictEqual(res.body.data[6].id, user1Attachment7Uuid);
      assert.strictEqual(res.body.data[6].type, 'attachments');

      // Attachment 5
      assert.isOk(res.body.data[7].attributes);
      assert.isOk(res.body.data[7].attributes['created-at']);
      assert.strictEqual(
        res.body.data[7].attributes.name,
        sampleData.attachments.attachment5.name,
      );
      assert.strictEqual(res.body.data[7].id, user1Attachment5Uuid);
      assert.strictEqual(res.body.data[7].type, 'attachments');

      // Attachment 10
      assert.isOk(res.body.data[8].attributes);
      assert.isOk(res.body.data[8].attributes['created-at']);
      assert.strictEqual(
        res.body.data[8].attributes.name,
        sampleData.attachments.attachment10.name,
      );
      assert.strictEqual(res.body.data[8].id, user1Attachment10Uuid);
      assert.strictEqual(res.body.data[8].type, 'attachments');

      // Attachment 17
      assert.isOk(res.body.data[9].attributes);
      assert.isOk(res.body.data[9].attributes['created-at']);
      assert.strictEqual(
        res.body.data[9].attributes.name,
        sampleData.attachments.attachment17.name,
      );
      assert.strictEqual(res.body.data[9].id, user1Attachment17Uuid);
      assert.strictEqual(res.body.data[9].type, 'attachments');

      // Attachment 20
      assert.isOk(res.body.data[10].attributes);
      assert.isOk(res.body.data[10].attributes['created-at']);
      assert.strictEqual(
        res.body.data[10].attributes.name,
        sampleData.attachments.attachment20.name,
      );
      assert.strictEqual(res.body.data[10].id, user1Attachment20Uuid);
      assert.strictEqual(res.body.data[10].type, 'attachments');

      // Attachment 15
      assert.isOk(res.body.data[11].attributes);
      assert.isOk(res.body.data[11].attributes['created-at']);
      assert.strictEqual(
        res.body.data[11].attributes.name,
        sampleData.attachments.attachment15.name,
      );
      assert.strictEqual(res.body.data[11].id, user1Attachment15Uuid);
      assert.strictEqual(res.body.data[11].type, 'attachments');

      // Attachment 25
      assert.isOk(res.body.data[12].attributes);
      assert.isOk(res.body.data[12].attributes['created-at']);
      assert.strictEqual(
        res.body.data[12].attributes.name,
        sampleData.attachments.attachment25.name,
      );
      assert.strictEqual(res.body.data[12].id, user1Attachment25Uuid);
      assert.strictEqual(res.body.data[12].type, 'attachments');

      // Attachment 24
      assert.isOk(res.body.data[13].attributes);
      assert.isOk(res.body.data[13].attributes['created-at']);
      assert.strictEqual(
        res.body.data[13].attributes.name,
        sampleData.attachments.attachment24.name,
      );
      assert.strictEqual(res.body.data[13].id, user1Attachment24Uuid);
      assert.strictEqual(res.body.data[13].type, 'attachments');

      // Attachment 27
      assert.isOk(res.body.data[14].attributes);
      assert.isOk(res.body.data[14].attributes['created-at']);
      assert.strictEqual(
        res.body.data[14].attributes.name,
        sampleData.attachments.attachment27.name,
      );
      assert.strictEqual(res.body.data[14].id, user1Attachment27Uuid);
      assert.strictEqual(res.body.data[14].type, 'attachments');

      // Attachment 11
      assert.isOk(res.body.data[15].attributes);
      assert.isOk(res.body.data[15].attributes['created-at']);
      assert.strictEqual(
        res.body.data[15].attributes.name,
        sampleData.attachments.attachment11.name,
      );
      assert.strictEqual(res.body.data[15].id, user1Attachment11Uuid);
      assert.strictEqual(res.body.data[15].type, 'attachments');

      // Attachment 23
      assert.isOk(res.body.data[16].attributes);
      assert.isOk(res.body.data[16].attributes['created-at']);
      assert.strictEqual(
        res.body.data[16].attributes.name,
        sampleData.attachments.attachment23.name,
      );
      assert.strictEqual(res.body.data[16].id, user1Attachment23Uuid);
      assert.strictEqual(res.body.data[16].type, 'attachments');

      // Attachment 2
      assert.isOk(res.body.data[17].attributes);
      assert.isOk(res.body.data[17].attributes['created-at']);
      assert.strictEqual(
        res.body.data[17].attributes.name,
        sampleData.attachments.attachment2.name,
      );
      assert.strictEqual(res.body.data[17].id, user1Attachment2Uuid);
      assert.strictEqual(res.body.data[17].type, 'attachments');

      // Attachment 8
      assert.isOk(res.body.data[18].attributes);
      assert.isOk(res.body.data[18].attributes['created-at']);
      assert.strictEqual(
        res.body.data[18].attributes.name,
        sampleData.attachments.attachment8.name,
      );
      assert.strictEqual(res.body.data[18].id, user1Attachment8Uuid);
      assert.strictEqual(res.body.data[18].type, 'attachments');

      // Attachment 21
      assert.isOk(res.body.data[19].attributes);
      assert.isOk(res.body.data[19].attributes['created-at']);
      assert.strictEqual(
        res.body.data[19].attributes.name,
        sampleData.attachments.attachment21.name,
      );
      assert.strictEqual(res.body.data[19].id, user1Attachment21Uuid);
      assert.strictEqual(res.body.data[19].type, 'attachments');

      // Attachment 26
      assert.isOk(res.body.data[20].attributes);
      assert.isOk(res.body.data[20].attributes['created-at']);
      assert.strictEqual(
        res.body.data[20].attributes.name,
        sampleData.attachments.attachment26.name,
      );
      assert.strictEqual(res.body.data[20].id, user1Attachment26Uuid);
      assert.strictEqual(res.body.data[20].type, 'attachments');

      // Attachment 9
      assert.isOk(res.body.data[21].attributes);
      assert.isOk(res.body.data[21].attributes['created-at']);
      assert.strictEqual(
        res.body.data[21].attributes.name,
        sampleData.attachments.attachment9.name,
      );
      assert.strictEqual(res.body.data[21].id, user1Attachment9Uuid);
      assert.strictEqual(res.body.data[21].type, 'attachments');

      // Attachment 12
      assert.isOk(res.body.data[22].attributes);
      assert.isOk(res.body.data[22].attributes['created-at']);
      assert.strictEqual(
        res.body.data[22].attributes.name,
        sampleData.attachments.attachment12.name,
      );
      assert.strictEqual(res.body.data[22].id, user1Attachment12Uuid);
      assert.strictEqual(res.body.data[22].type, 'attachments');

      // Attachment 13
      assert.isOk(res.body.data[23].attributes);
      assert.isOk(res.body.data[23].attributes['created-at']);
      assert.strictEqual(
        res.body.data[23].attributes.name,
        sampleData.attachments.attachment13.name,
      );
      assert.strictEqual(res.body.data[23].id, user1Attachment13Uuid);
      assert.strictEqual(res.body.data[23].type, 'attachments');

      // Attachment 3
      assert.isOk(res.body.data[24].attributes);
      assert.isOk(res.body.data[24].attributes['created-at']);
      assert.strictEqual(
        res.body.data[24].attributes.name,
        sampleData.attachments.attachment3.name,
      );
      assert.strictEqual(res.body.data[24].id, user1Attachment3Uuid);
      assert.strictEqual(res.body.data[24].type, 'attachments');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 attachments as user 1 with expense 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/attachments?expense_id=${user1Expense1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Attachment 6
      assert.isOk(res.body.data[0].attributes);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(
        res.body.data[0].attributes.name,
        sampleData.attachments.attachment6.name,
      );
      assert.strictEqual(res.body.data[0].id, user1Attachment6Uuid);
      assert.strictEqual(res.body.data[0].type, 'attachments');

      // Attachment 4
      assert.isOk(res.body.data[1].attributes);
      assert.isOk(res.body.data[1].attributes['created-at']);
      assert.strictEqual(
        res.body.data[1].attributes.name,
        sampleData.attachments.attachment4.name,
      );
      assert.strictEqual(res.body.data[1].id, user1Attachment4Uuid);
      assert.strictEqual(res.body.data[1].type, 'attachments');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 attachments as user 1 with expense 1 limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/attachments?expense_id=${user1Expense1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Attachment 11
      assert.isOk(res.body.data[0].attributes);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(
        res.body.data[0].attributes.name,
        sampleData.attachments.attachment11.name,
      );
      assert.strictEqual(res.body.data[0].id, user1Attachment11Uuid);
      assert.strictEqual(res.body.data[0].type, 'attachments');

      // Attachment 23
      assert.isOk(res.body.data[1].attributes);
      assert.isOk(res.body.data[1].attributes['created-at']);
      assert.strictEqual(
        res.body.data[1].attributes.name,
        sampleData.attachments.attachment23.name,
      );
      assert.strictEqual(res.body.data[1].id, user1Attachment23Uuid);
      assert.strictEqual(res.body.data[1].type, 'attachments');

      // Attachment 2
      assert.isOk(res.body.data[2].attributes);
      assert.isOk(res.body.data[2].attributes['created-at']);
      assert.strictEqual(
        res.body.data[2].attributes.name,
        sampleData.attachments.attachment2.name,
      );
      assert.strictEqual(res.body.data[2].id, user1Attachment2Uuid);
      assert.strictEqual(res.body.data[2].type, 'attachments');

      // Attachment 8
      assert.isOk(res.body.data[3].attributes);
      assert.isOk(res.body.data[3].attributes['created-at']);
      assert.strictEqual(
        res.body.data[3].attributes.name,
        sampleData.attachments.attachment8.name,
      );
      assert.strictEqual(res.body.data[3].id, user1Attachment8Uuid);
      assert.strictEqual(res.body.data[3].type, 'attachments');

      // Attachment 21
      assert.isOk(res.body.data[4].attributes);
      assert.isOk(res.body.data[4].attributes['created-at']);
      assert.strictEqual(
        res.body.data[4].attributes.name,
        sampleData.attachments.attachment21.name,
      );
      assert.strictEqual(res.body.data[4].id, user1Attachment21Uuid);
      assert.strictEqual(res.body.data[4].type, 'attachments');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 attachment as user 1 with expense 2', async function() {
      const res = await chai.request(server)
        .get(`/attachments?expense_id=${user1Expense2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Attachment 28
      assert.isOk(res.body.data[0].attributes);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(
        res.body.data[0].attributes.name,
        sampleData.attachments.attachment28.name,
      );
      assert.strictEqual(res.body.data[0].id, user1Attachment28Uuid);
      assert.strictEqual(res.body.data[0].type, 'attachments');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });
  });
});
