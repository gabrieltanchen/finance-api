const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const { AttachmentError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - AttachmentCtrl.createAttachment', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1ExpenseUuid;
  let user1HouseholdMemberUuid;
  let user1HouseholdUuid;
  let user1SubcategoryUuid;
  let user1Uuid;
  let user1VendorUuid;
  let user2ExpenseUuid;
  let user2HouseholdMemberUuid;
  let user2HouseholdUuid;
  let user2SubcategoryUuid;
  let user2VendorUuid;

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

  beforeEach('create user 1 subcategory', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category2.name,
    });
    user1SubcategoryUuid = subcategory.get('uuid');
  });

  beforeEach('create user 1 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor1.name,
    });
    user1VendorUuid = vendor.get('uuid');
  });

  beforeEach('create user 1 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user1.firstName,
    });
    user1HouseholdMemberUuid = householdMember.get('uuid');
  });

  beforeEach('create user 1 expense', async function() {
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      household_member_uuid: user1HouseholdMemberUuid,
      reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
      subcategory_uuid: user1SubcategoryUuid,
      vendor_uuid: user1VendorUuid,
    });
    user1ExpenseUuid = expense.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user2.lastName,
    });
    user2HouseholdUuid = household.get('uuid');
    await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
  });

  beforeEach('create user 2 subcategory', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category3.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category4.name,
    });
    user2SubcategoryUuid = subcategory.get('uuid');
  });

  beforeEach('create user 2 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor2.name,
    });
    user2VendorUuid = vendor.get('uuid');
  });

  beforeEach('create user 2 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.users.user2.firstName,
    });
    user2HouseholdMemberUuid = householdMember.get('uuid');
  });

  beforeEach('create user 2 expense', async function() {
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense2.amount_cents,
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense2.description,
      household_member_uuid: user2HouseholdMemberUuid,
      reimbursed_cents: sampleData.expenses.expense2.reimbursed_cents,
      subcategory_uuid: user2SubcategoryUuid,
      vendor_uuid: user2VendorUuid,
    });
    user2ExpenseUuid = expense.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no expense UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.createAttachment({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: null,
        name: sampleData.attachments.attachment1.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Expense is required');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.createAttachment({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
        name: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Name is required');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.AttachmentCtrl.createAttachment({
        auditApiCallUuid: null,
        expenseUuid: user1ExpenseUuid,
        name: sampleData.attachments.attachment1.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.AttachmentCtrl.createAttachment({
        auditApiCallUuid: uuidv4(),
        expenseUuid: user1ExpenseUuid,
        name: sampleData.attachments.attachment1.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof AttachmentError);
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
      await controllers.AttachmentCtrl.createAttachment({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
        name: sampleData.attachments.attachment1.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.createAttachment({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: uuidv4(),
        name: sampleData.attachments.attachment1.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Expense not found');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.createAttachment({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user2ExpenseUuid,
        name: sampleData.attachments.attachment1.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Expense not found');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating an attachment', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const attachmentUuid = await controllers.AttachmentCtrl.createAttachment({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1ExpenseUuid,
      name: sampleData.attachments.attachment1.name,
    });
    assert.isOk(attachmentUuid);

    // Verify the Attachment instance.
    const attachment = await models.Attachment.findOne({
      attributes: ['entity_type', 'entity_uuid', 'name', 'uuid'],
      where: {
        uuid: attachmentUuid,
      },
    });
    assert.isOk(attachment);
    assert.strictEqual(attachment.get('entity_type'), 'expense');
    assert.strictEqual(attachment.get('entity_uuid'), user1ExpenseUuid);
    assert.strictEqual(attachment.get('name'), sampleData.attachments.attachment1.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newAttachment = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Attachment
        && newInstance.get('uuid') === attachment.get('uuid');
    });
    assert.isOk(newAttachment);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });
});
