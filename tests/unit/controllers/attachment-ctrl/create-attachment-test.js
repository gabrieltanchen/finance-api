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

  it('should reject with no expense UUID');

  it('should reject with no name');

  it('should reject with no audit API call');

  it('should reject when the audit API call does not exist');

  it('should reject when the user does not exist');

  it('should resolve creating an attachment');
});
