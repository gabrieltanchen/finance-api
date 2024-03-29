const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { ExpenseError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - ExpenseCtrl.updateExpense', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let expenseUuid;
  let user1HouseholdMember1Uuid;
  let user1HouseholdMember2Uuid;
  let user1HouseholdUuid;
  let user1Subcategory1Uuid;
  let user1Subcategory2Uuid;
  let user1Uuid;
  let user1Vendor1Uuid;
  let user1Vendor2Uuid;
  let user2HouseholdMember1Uuid;
  let user2HouseholdMember2Uuid;
  let user2HouseholdUuid;
  let user2Subcategory1Uuid;
  let user2Subcategory2Uuid;
  let user2Uuid;
  let user2Vendor1Uuid;
  let user2Vendor2Uuid;

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

  beforeEach('create user 1 subcategory 1', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category2.name,
    });
    user1Subcategory1Uuid = subcategory.get('uuid');
  });

  beforeEach('create user 1 subcategory 2', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category3.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category4.name,
    });
    user1Subcategory2Uuid = subcategory.get('uuid');
  });

  beforeEach('create user 1 vendor 1', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor1.name,
    });
    user1Vendor1Uuid = vendor.get('uuid');
  });

  beforeEach('create user 1 vendor 2', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor2.name,
    });
    user1Vendor2Uuid = vendor.get('uuid');
  });

  beforeEach('create user 1 household member 1', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user1.firstName,
    });
    user1HouseholdMember1Uuid = householdMember.get('uuid');
  });

  beforeEach('create user 1 household member 2', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user2.firstName,
    });
    user1HouseholdMember2Uuid = householdMember.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user2.lastName,
    });
    user2HouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
    user2Uuid = user.get('uuid');
  });

  beforeEach('create user 2 subcategory 1', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category5.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category6.name,
    });
    user2Subcategory1Uuid = subcategory.get('uuid');
  });

  beforeEach('create user 2 subcategory 2', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category7.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category8.name,
    });
    user2Subcategory2Uuid = subcategory.get('uuid');
  });

  beforeEach('create user 2 vendor 1', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor3.name,
    });
    user2Vendor1Uuid = vendor.get('uuid');
  });

  beforeEach('create user 2 vendor 2', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor4.name,
    });
    user2Vendor2Uuid = vendor.get('uuid');
  });

  beforeEach('create user 2 household member 1', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.users.user3.firstName,
    });
    user2HouseholdMember1Uuid = householdMember.get('uuid');
  });

  beforeEach('create user 2 household member 2', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.users.user4.firstName,
    });
    user2HouseholdMember2Uuid = householdMember.get('uuid');
  });

  beforeEach('create expense', async function() {
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      household_member_uuid: user1HouseholdMember1Uuid,
      reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
      subcategory_uuid: user1Subcategory1Uuid,
      vendor_uuid: user1Vendor1Uuid,
    });
    expenseUuid = expense.get('uuid');
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
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid: null,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Expense is required');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no category UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: null,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category is required');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no vendor UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor is required');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no household member UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member is required');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: null,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: 'invalid date',
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: null,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no reimbursed amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: null,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid reimbursed amount');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid reimbursed amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: 'invalid reimbursed amount',
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid reimbursed amount');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: null,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: 1234,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: null,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: uuidv4(),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof ExpenseError);
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
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid: uuidv4(),
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user2HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user2Subcategory2Uuid,
        vendorUuid: user2Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense subcategory belongs to a different household', async function() {
    try {
      await models.Expense.update({
        subcategory_uuid: user2Subcategory1Uuid,
      }, {
        where: {
          uuid: expenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense vendor belongs to a different household', async function() {
    try {
      await models.Expense.update({
        vendor_uuid: user2Vendor1Uuid,
      }, {
        where: {
          uuid: expenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense household member belongs to a different household', async function() {
    try {
      await models.Expense.update({
        household_member_uuid: user2HouseholdMember1Uuid,
      }, {
        where: {
          uuid: expenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember1Uuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1Vendor1Uuid,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember1Uuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'fund_uuid',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.isNull(expense.get('fund_uuid'));
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the date', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember1Uuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'fund_uuid',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense2.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.isNull(expense.get('fund_uuid'));
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the description', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense2.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember1Uuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'fund_uuid',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense2.description);
    assert.isNull(expense.get('fund_uuid'));
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the reimbursed amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember1Uuid,
      reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'fund_uuid',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.isNull(expense.get('fund_uuid'));
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense2.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the subcategory when it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: uuidv4(),
        vendorUuid: user1Vendor1Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject updating the subcategory when it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user2Subcategory2Uuid,
        vendorUuid: user1Vendor1Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember1Uuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'fund_uuid',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory2Uuid);
    assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory2Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.isNull(expense.get('fund_uuid'));
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the vendor when it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject updating the vendor when it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user2Vendor2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember1Uuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1Vendor2Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'fund_uuid',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.isNull(expense.get('fund_uuid'));
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor2Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor2Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the household member when it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        householdMemberUuid: uuidv4(),
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1Vendor1Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject updating the household member when it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        householdMemberUuid: user2HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1Vendor1Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember2Uuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'fund_uuid',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.isNull(expense.get('fund_uuid'));
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember2Uuid);
    assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating all attributes', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amount: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense2.description,
      expenseUuid,
      householdMemberUuid: user1HouseholdMember2Uuid,
      reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1Vendor2Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'fund_uuid',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory2Uuid);
    assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory2Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense2.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense2.description);
    assert.isNull(expense.get('fund_uuid'));
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember2Uuid);
    assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense2.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor2Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor2Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when updating an expense for a fund', function() {
    const FUND1_INITIAL_BALANCE = 100000;
    const FUND2_INITIAL_BALANCE = 150000;

    let user1Fund1Uuid;
    let user1Fund2Uuid;
    let user2FundUuid;

    beforeEach('create user 1 fund 1', async function() {
      const fund = await models.Fund.create({
        balance_cents: FUND1_INITIAL_BALANCE,
        household_uuid: user1HouseholdUuid,
        name: sampleData.funds.fund1.name,
      });
      user1Fund1Uuid = fund.get('uuid');
    });

    beforeEach('create user 1 fund 2', async function() {
      const fund = await models.Fund.create({
        balance_cents: FUND2_INITIAL_BALANCE,
        household_uuid: user1HouseholdUuid,
        name: sampleData.funds.fund2.name,
      });
      user1Fund2Uuid = fund.get('uuid');
    });

    beforeEach('create user 2 fund', async function() {
      const fund = await models.Fund.create({
        household_uuid: user2HouseholdUuid,
        name: sampleData.funds.fund3.name,
      });
      user2FundUuid = fund.get('uuid');
    });

    beforeEach('update expense to belong to fund 1', async function() {
      await models.Expense.update({
        fund_uuid: user1Fund1Uuid,
      }, {
        where: {
          uuid: expenseUuid,
        },
      });
    });

    // This should not happen.
    it('should reject when the expense fund belongs to a different household', async function() {
      try {
        await models.Expense.update({
          fund_uuid: user2FundUuid,
        }, {
          where: {
            uuid: expenseUuid,
          },
        });
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.updateExpense({
          amount: sampleData.expenses.expense2.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.expenses.expense2.date,
          description: sampleData.expenses.expense2.description,
          expenseUuid,
          fundUuid: user1Fund1Uuid,
          householdMemberUuid: user1HouseholdMember2Uuid,
          reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
          subcategoryUuid: user1Subcategory2Uuid,
          vendorUuid: user1Vendor2Uuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Not found');
        assert.isTrue(err instanceof ExpenseError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve updating the amount', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        fundUuid: user1Fund1Uuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1Vendor1Uuid,
      });

      // Verify the Expense instance.
      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'fund_uuid',
          'household_member_uuid',
          'reimbursed_cents',
          'subcategory_uuid',
          'uuid',
          'vendor_uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Subcategory,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
        }],
        where: {
          uuid: expenseUuid,
        },
      });
      assert.isOk(expense);
      assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
      assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
      assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
      assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
      assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
      assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
      assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

      // Verify that the Fund balance was updated.
      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        where: {
          uuid: user1Fund1Uuid,
        },
      });
      assert.isOk(fund);
      const oldExpenseAmount = sampleData.expenses.expense1.amount_cents
        - sampleData.expenses.expense1.reimbursed_cents;
      const newExpenseAmount = sampleData.expenses.expense2.amount_cents
        - sampleData.expenses.expense1.reimbursed_cents;
      const expenseDifference = oldExpenseAmount - newExpenseAmount;
      assert.strictEqual(
        fund.get('balance_cents'),
        FUND1_INITIAL_BALANCE + expenseDifference,
      );

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Expense
          && updateInstance.get('uuid') === expenseUuid;
      });
      assert.isOk(updateExpense);
      const updateFund = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Fund
          && updateInstance.get('uuid') === user1Fund1Uuid;
      });
      assert.isOk(updateFund);
      assert.strictEqual(trackChangesParams.changeList.length, 2);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve updating the date', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        fundUuid: user1Fund1Uuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1Vendor1Uuid,
      });

      // Verify the Expense instance.
      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'fund_uuid',
          'household_member_uuid',
          'reimbursed_cents',
          'subcategory_uuid',
          'uuid',
          'vendor_uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Subcategory,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
        }],
        where: {
          uuid: expenseUuid,
        },
      });
      assert.isOk(expense);
      assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
      assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.get('date'), sampleData.expenses.expense2.date);
      assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
      assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
      assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
      assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
      assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

      // Verify that the Fund balance wasn't updated.
      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        where: {
          uuid: user1Fund1Uuid,
        },
      });
      assert.isOk(fund);
      assert.strictEqual(fund.get('balance_cents'), FUND1_INITIAL_BALANCE);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Expense
          && updateInstance.get('uuid') === expenseUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve updating the description', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        fundUuid: user1Fund1Uuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1Vendor1Uuid,
      });

      // Verify the Expense instance.
      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'fund_uuid',
          'household_member_uuid',
          'reimbursed_cents',
          'subcategory_uuid',
          'uuid',
          'vendor_uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Subcategory,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
        }],
        where: {
          uuid: expenseUuid,
        },
      });
      assert.isOk(expense);
      assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
      assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
      assert.strictEqual(expense.get('description'), sampleData.expenses.expense2.description);
      assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
      assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
      assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
      assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

      // Verify that the Fund balance wasn't updated.
      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        where: {
          uuid: user1Fund1Uuid,
        },
      });
      assert.isOk(fund);
      assert.strictEqual(fund.get('balance_cents'), FUND1_INITIAL_BALANCE);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Expense
          && updateInstance.get('uuid') === expenseUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve updating the reimbursed amount', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        fundUuid: user1Fund1Uuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1Vendor1Uuid,
      });

      // Verify the Expense instance.
      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'fund_uuid',
          'household_member_uuid',
          'reimbursed_cents',
          'subcategory_uuid',
          'uuid',
          'vendor_uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Subcategory,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
        }],
        where: {
          uuid: expenseUuid,
        },
      });
      assert.isOk(expense);
      assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
      assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
      assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
      assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
      assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense2.reimbursed_cents);
      assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
      assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

      // Verify that the Fund balance was updated.
      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        where: {
          uuid: user1Fund1Uuid,
        },
      });
      assert.isOk(fund);
      const oldExpenseAmount = sampleData.expenses.expense1.amount_cents
        - sampleData.expenses.expense1.reimbursed_cents;
      const newExpenseAmount = sampleData.expenses.expense1.amount_cents
        - sampleData.expenses.expense2.reimbursed_cents;
      const expenseDifference = oldExpenseAmount - newExpenseAmount;
      assert.strictEqual(
        fund.get('balance_cents'),
        FUND1_INITIAL_BALANCE + expenseDifference,
      );

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Expense
          && updateInstance.get('uuid') === expenseUuid;
      });
      assert.isOk(updateExpense);
      const updateFund = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Fund
          && updateInstance.get('uuid') === user1Fund1Uuid;
      });
      assert.isOk(updateFund);
      assert.strictEqual(trackChangesParams.changeList.length, 2);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve updating the subcategory', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        fundUuid: user1Fund1Uuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory2Uuid,
        vendorUuid: user1Vendor1Uuid,
      });

      // Verify the Expense instance.
      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'fund_uuid',
          'household_member_uuid',
          'reimbursed_cents',
          'subcategory_uuid',
          'uuid',
          'vendor_uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Subcategory,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
        }],
        where: {
          uuid: expenseUuid,
        },
      });
      assert.isOk(expense);
      assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
      assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory2Uuid);
      assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory2Uuid);
      assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
      assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
      assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
      assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
      assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
      assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

      // Verify that the Fund balance wasn't updated.
      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        where: {
          uuid: user1Fund1Uuid,
        },
      });
      assert.isOk(fund);
      assert.strictEqual(fund.get('balance_cents'), FUND1_INITIAL_BALANCE);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Expense
          && updateInstance.get('uuid') === expenseUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve updating the vendor', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        fundUuid: user1Fund1Uuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1Vendor2Uuid,
      });

      // Verify the Expense instance.
      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'fund_uuid',
          'household_member_uuid',
          'reimbursed_cents',
          'subcategory_uuid',
          'uuid',
          'vendor_uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Subcategory,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
        }],
        where: {
          uuid: expenseUuid,
        },
      });
      assert.isOk(expense);
      assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
      assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
      assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
      assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
      assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
      assert.strictEqual(expense.get('vendor_uuid'), user1Vendor2Uuid);
      assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor2Uuid);

      // Verify that the Fund balance wasn't updated.
      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        where: {
          uuid: user1Fund1Uuid,
        },
      });
      assert.isOk(fund);
      assert.strictEqual(fund.get('balance_cents'), FUND1_INITIAL_BALANCE);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Expense
          && updateInstance.get('uuid') === expenseUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve updating the household member', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        fundUuid: user1Fund1Uuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1Vendor1Uuid,
      });

      // Verify the Expense instance.
      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'fund_uuid',
          'household_member_uuid',
          'reimbursed_cents',
          'subcategory_uuid',
          'uuid',
          'vendor_uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Subcategory,
          required: true,
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
        }],
        where: {
          uuid: expenseUuid,
        },
      });
      assert.isOk(expense);
      assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
      assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
      assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
      assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
      assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
      assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember2Uuid);
      assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);
      assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
      assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
      assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

      // Verify that the Fund balance wasn't updated.
      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        where: {
          uuid: user1Fund1Uuid,
        },
      });
      assert.isOk(fund);
      assert.strictEqual(fund.get('balance_cents'), FUND1_INITIAL_BALANCE);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Expense
          && updateInstance.get('uuid') === expenseUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    describe('when adding a fund to an expense', function() {
      beforeEach('remove fund from expense', async function() {
        await models.Expense.update({
          fund_uuid: null,
        }, {
          where: {
            uuid: expenseUuid,
          },
        });
      });

      it('should reject when the fund does not exist', async function() {
        try {
          const apiCall = await models.Audit.ApiCall.create({
            user_uuid: user1Uuid,
          });
          await controllers.ExpenseCtrl.updateExpense({
            amount: sampleData.expenses.expense1.amount_cents,
            auditApiCallUuid: apiCall.get('uuid'),
            date: sampleData.expenses.expense1.date,
            description: sampleData.expenses.expense1.description,
            expenseUuid,
            fundUuid: uuidv4(),
            householdMemberUuid: user1HouseholdMember1Uuid,
            reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
            subcategoryUuid: user1Subcategory1Uuid,
            vendorUuid: user1Vendor1Uuid,
          });
          /* istanbul ignore next */
          throw new Error('Expected to reject not resolve.');
        } catch (err) {
          assert.isOk(err);
          assert.strictEqual(err.message, 'Fund not found');
          assert.isTrue(err instanceof ExpenseError);
        }
        assert.strictEqual(trackChangesSpy.callCount, 0);
      });

      it('should reject when the fund belongs to a different household', async function() {
        try {
          const apiCall = await models.Audit.ApiCall.create({
            user_uuid: user1Uuid,
          });
          await controllers.ExpenseCtrl.updateExpense({
            amount: sampleData.expenses.expense1.amount_cents,
            auditApiCallUuid: apiCall.get('uuid'),
            date: sampleData.expenses.expense1.date,
            description: sampleData.expenses.expense1.description,
            expenseUuid,
            fundUuid: user2FundUuid,
            householdMemberUuid: user1HouseholdMember1Uuid,
            reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
            subcategoryUuid: user1Subcategory1Uuid,
            vendorUuid: user1Vendor1Uuid,
          });
          /* istanbul ignore next */
          throw new Error('Expected to reject not resolve.');
        } catch (err) {
          assert.isOk(err);
          assert.strictEqual(err.message, 'Fund not found');
          assert.isTrue(err instanceof ExpenseError);
        }
        assert.strictEqual(trackChangesSpy.callCount, 0);
      });

      it('should resolve adding the fund', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.updateExpense({
          amount: sampleData.expenses.expense1.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.expenses.expense1.date,
          description: sampleData.expenses.expense1.description,
          expenseUuid,
          fundUuid: user1Fund1Uuid,
          householdMemberUuid: user1HouseholdMember1Uuid,
          reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
          subcategoryUuid: user1Subcategory1Uuid,
          vendorUuid: user1Vendor1Uuid,
        });

        // Verify the Expense instance.
        const expense = await models.Expense.findOne({
          attributes: [
            'amount_cents',
            'date',
            'description',
            'fund_uuid',
            'household_member_uuid',
            'reimbursed_cents',
            'subcategory_uuid',
            'uuid',
            'vendor_uuid',
          ],
          include: [{
            attributes: ['uuid'],
            model: models.HouseholdMember,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Subcategory,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Vendor,
            required: true,
          }],
          where: {
            uuid: expenseUuid,
          },
        });
        assert.isOk(expense);
        assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
        assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
        assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
        assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
        assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
        assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
        assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
        assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
        assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
        assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
        assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

        // Verify that the Fund balance was updated.
        const fund = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          where: {
            uuid: user1Fund1Uuid,
          },
        });
        assert.isOk(fund);
        assert.strictEqual(
          fund.get('balance_cents'),
          FUND1_INITIAL_BALANCE - (
            sampleData.expenses.expense1.amount_cents
              - sampleData.expenses.expense1.reimbursed_cents
          ),
        );

        assert.strictEqual(trackChangesSpy.callCount, 1);
        const trackChangesParams = trackChangesSpy.getCall(0).args[0];
        assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
        assert.isOk(trackChangesParams.changeList);
        const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Expense
            && updateInstance.get('uuid') === expenseUuid;
        });
        assert.isOk(updateExpense);
        const updateFund = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Fund
            && updateInstance.get('uuid') === user1Fund1Uuid;
        });
        assert.isOk(updateFund);
        assert.strictEqual(trackChangesParams.changeList.length, 2);
        assert.isNotOk(trackChangesParams.deleteList);
        assert.isNotOk(trackChangesParams.newList);
        assert.isOk(trackChangesParams.transaction);
      });

      it('should resolve when updating all other attributes', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.updateExpense({
          amount: sampleData.expenses.expense2.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.expenses.expense2.date,
          description: sampleData.expenses.expense2.description,
          expenseUuid,
          fundUuid: user1Fund1Uuid,
          householdMemberUuid: user1HouseholdMember2Uuid,
          reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
          subcategoryUuid: user1Subcategory2Uuid,
          vendorUuid: user1Vendor2Uuid,
        });

        // Verify the Expense instance.
        const expense = await models.Expense.findOne({
          attributes: [
            'amount_cents',
            'date',
            'description',
            'fund_uuid',
            'household_member_uuid',
            'reimbursed_cents',
            'subcategory_uuid',
            'uuid',
            'vendor_uuid',
          ],
          include: [{
            attributes: ['uuid'],
            model: models.HouseholdMember,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Subcategory,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Vendor,
            required: true,
          }],
          where: {
            uuid: expenseUuid,
          },
        });
        assert.isOk(expense);
        assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
        assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory2Uuid);
        assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory2Uuid);
        assert.strictEqual(expense.get('date'), sampleData.expenses.expense2.date);
        assert.strictEqual(expense.get('description'), sampleData.expenses.expense2.description);
        assert.strictEqual(expense.get('fund_uuid'), user1Fund1Uuid);
        assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember2Uuid);
        assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);
        assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense2.reimbursed_cents);
        assert.strictEqual(expense.get('vendor_uuid'), user1Vendor2Uuid);
        assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor2Uuid);

        // Verify that the Fund balance was updated.
        const fund = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          where: {
            uuid: user1Fund1Uuid,
          },
        });
        assert.isOk(fund);
        assert.strictEqual(
          fund.get('balance_cents'),
          FUND1_INITIAL_BALANCE - (
            sampleData.expenses.expense2.amount_cents
              - sampleData.expenses.expense2.reimbursed_cents
          ),
        );

        assert.strictEqual(trackChangesSpy.callCount, 1);
        const trackChangesParams = trackChangesSpy.getCall(0).args[0];
        assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
        assert.isOk(trackChangesParams.changeList);
        const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Expense
            && updateInstance.get('uuid') === expenseUuid;
        });
        assert.isOk(updateExpense);
        const updateFund = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Fund
            && updateInstance.get('uuid') === user1Fund1Uuid;
        });
        assert.isOk(updateFund);
        assert.strictEqual(trackChangesParams.changeList.length, 2);
        assert.isNotOk(trackChangesParams.deleteList);
        assert.isNotOk(trackChangesParams.newList);
        assert.isOk(trackChangesParams.transaction);
      });
    });

    describe('when removing a fund from an expense', function() {
      it('should resolve removing the fund', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.updateExpense({
          amount: sampleData.expenses.expense1.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.expenses.expense1.date,
          description: sampleData.expenses.expense1.description,
          expenseUuid,
          fundUuid: null,
          householdMemberUuid: user1HouseholdMember1Uuid,
          reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
          subcategoryUuid: user1Subcategory1Uuid,
          vendorUuid: user1Vendor1Uuid,
        });

        // Verify the Expense instance.
        const expense = await models.Expense.findOne({
          attributes: [
            'amount_cents',
            'date',
            'description',
            'fund_uuid',
            'household_member_uuid',
            'reimbursed_cents',
            'subcategory_uuid',
            'uuid',
            'vendor_uuid',
          ],
          include: [{
            attributes: ['uuid'],
            model: models.HouseholdMember,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Subcategory,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Vendor,
            required: true,
          }],
          where: {
            uuid: expenseUuid,
          },
        });
        assert.isOk(expense);
        assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
        assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
        assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
        assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
        assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
        assert.isNull(expense.get('fund_uuid'));
        assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
        assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
        assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
        assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
        assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

        // Verify that the Fund balance was updated.
        const fund = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          where: {
            uuid: user1Fund1Uuid,
          },
        });
        assert.isOk(fund);
        assert.strictEqual(
          fund.get('balance_cents'),
          FUND1_INITIAL_BALANCE + (
            sampleData.expenses.expense1.amount_cents
              - sampleData.expenses.expense1.reimbursed_cents
          ),
        );

        assert.strictEqual(trackChangesSpy.callCount, 1);
        const trackChangesParams = trackChangesSpy.getCall(0).args[0];
        assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
        assert.isOk(trackChangesParams.changeList);
        const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Expense
            && updateInstance.get('uuid') === expenseUuid;
        });
        assert.isOk(updateExpense);
        const updateFund = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Fund
            && updateInstance.get('uuid') === user1Fund1Uuid;
        });
        assert.isOk(updateFund);
        assert.strictEqual(trackChangesParams.changeList.length, 2);
        assert.isNotOk(trackChangesParams.deleteList);
        assert.isNotOk(trackChangesParams.newList);
        assert.isOk(trackChangesParams.transaction);
      });

      it('should resolve when updating all other attributes', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.updateExpense({
          amount: sampleData.expenses.expense2.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.expenses.expense2.date,
          description: sampleData.expenses.expense2.description,
          expenseUuid,
          fundUuid: null,
          householdMemberUuid: user1HouseholdMember2Uuid,
          reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
          subcategoryUuid: user1Subcategory2Uuid,
          vendorUuid: user1Vendor2Uuid,
        });

        // Verify the Expense instance.
        const expense = await models.Expense.findOne({
          attributes: [
            'amount_cents',
            'date',
            'description',
            'fund_uuid',
            'household_member_uuid',
            'reimbursed_cents',
            'subcategory_uuid',
            'uuid',
            'vendor_uuid',
          ],
          include: [{
            attributes: ['uuid'],
            model: models.HouseholdMember,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Subcategory,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Vendor,
            required: true,
          }],
          where: {
            uuid: expenseUuid,
          },
        });
        assert.isOk(expense);
        assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
        assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory2Uuid);
        assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory2Uuid);
        assert.strictEqual(expense.get('date'), sampleData.expenses.expense2.date);
        assert.strictEqual(expense.get('description'), sampleData.expenses.expense2.description);
        assert.isNull(expense.get('fund_uuid'));
        assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember2Uuid);
        assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);
        assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense2.reimbursed_cents);
        assert.strictEqual(expense.get('vendor_uuid'), user1Vendor2Uuid);
        assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor2Uuid);

        // Verify that the Fund balance was updated.
        const fund = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          where: {
            uuid: user1Fund1Uuid,
          },
        });
        assert.isOk(fund);
        assert.strictEqual(
          fund.get('balance_cents'),
          FUND1_INITIAL_BALANCE + (
            sampleData.expenses.expense1.amount_cents
              - sampleData.expenses.expense1.reimbursed_cents
          ),
        );

        assert.strictEqual(trackChangesSpy.callCount, 1);
        const trackChangesParams = trackChangesSpy.getCall(0).args[0];
        assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
        assert.isOk(trackChangesParams.changeList);
        const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Expense
            && updateInstance.get('uuid') === expenseUuid;
        });
        assert.isOk(updateExpense);
        const updateFund = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Fund
            && updateInstance.get('uuid') === user1Fund1Uuid;
        });
        assert.isOk(updateFund);
        assert.strictEqual(trackChangesParams.changeList.length, 2);
        assert.isNotOk(trackChangesParams.deleteList);
        assert.isNotOk(trackChangesParams.newList);
        assert.isOk(trackChangesParams.transaction);
      });
    });

    describe('when updating to a different fund', async function() {
      it('should reject when the new fund does not exist', async function() {
        try {
          const apiCall = await models.Audit.ApiCall.create({
            user_uuid: user1Uuid,
          });
          await controllers.ExpenseCtrl.updateExpense({
            amount: sampleData.expenses.expense1.amount_cents,
            auditApiCallUuid: apiCall.get('uuid'),
            date: sampleData.expenses.expense1.date,
            description: sampleData.expenses.expense1.description,
            expenseUuid,
            fundUuid: uuidv4(),
            householdMemberUuid: user1HouseholdMember1Uuid,
            reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
            subcategoryUuid: user1Subcategory1Uuid,
            vendorUuid: user1Vendor1Uuid,
          });
          /* istanbul ignore next */
          throw new Error('Expected to reject not resolve.');
        } catch (err) {
          assert.isOk(err);
          assert.strictEqual(err.message, 'Fund not found');
          assert.isTrue(err instanceof ExpenseError);
        }
        assert.strictEqual(trackChangesSpy.callCount, 0);
      });

      it('should reject when the new fund belongs to a different household', async function() {
        try {
          const apiCall = await models.Audit.ApiCall.create({
            user_uuid: user1Uuid,
          });
          await controllers.ExpenseCtrl.updateExpense({
            amount: sampleData.expenses.expense1.amount_cents,
            auditApiCallUuid: apiCall.get('uuid'),
            date: sampleData.expenses.expense1.date,
            description: sampleData.expenses.expense1.description,
            expenseUuid,
            fundUuid: user2FundUuid,
            householdMemberUuid: user1HouseholdMember1Uuid,
            reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
            subcategoryUuid: user1Subcategory1Uuid,
            vendorUuid: user1Vendor1Uuid,
          });
          /* istanbul ignore next */
          throw new Error('Expected to reject not resolve.');
        } catch (err) {
          assert.isOk(err);
          assert.strictEqual(err.message, 'Fund not found');
          assert.isTrue(err instanceof ExpenseError);
        }
        assert.strictEqual(trackChangesSpy.callCount, 0);
      });

      it('should resolve updating to the new fund', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.updateExpense({
          amount: sampleData.expenses.expense1.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.expenses.expense1.date,
          description: sampleData.expenses.expense1.description,
          expenseUuid,
          fundUuid: user1Fund2Uuid,
          householdMemberUuid: user1HouseholdMember1Uuid,
          reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
          subcategoryUuid: user1Subcategory1Uuid,
          vendorUuid: user1Vendor1Uuid,
        });

        // Verify the Expense instance.
        const expense = await models.Expense.findOne({
          attributes: [
            'amount_cents',
            'date',
            'description',
            'fund_uuid',
            'household_member_uuid',
            'reimbursed_cents',
            'subcategory_uuid',
            'uuid',
            'vendor_uuid',
          ],
          include: [{
            attributes: ['uuid'],
            model: models.HouseholdMember,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Subcategory,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Vendor,
            required: true,
          }],
          where: {
            uuid: expenseUuid,
          },
        });
        assert.isOk(expense);
        assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
        assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory1Uuid);
        assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory1Uuid);
        assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
        assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
        assert.strictEqual(expense.get('fund_uuid'), user1Fund2Uuid);
        assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember1Uuid);
        assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);
        assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
        assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
        assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

        // Verify that Fund 1 was updated.
        const fund1 = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          where: {
            uuid: user1Fund1Uuid,
          },
        });
        assert.isOk(fund1);
        assert.strictEqual(
          fund1.get('balance_cents'),
          FUND1_INITIAL_BALANCE + (
            sampleData.expenses.expense1.amount_cents
              - sampleData.expenses.expense1.reimbursed_cents
          ),
        );

        // Verify that Fund 2 was updated.
        const fund2 = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          where: {
            uuid: user1Fund2Uuid,
          },
        });
        assert.isOk(fund2);
        assert.strictEqual(
          fund2.get('balance_cents'),
          FUND2_INITIAL_BALANCE - (
            sampleData.expenses.expense1.amount_cents
              - sampleData.expenses.expense1.reimbursed_cents
          ),
        );

        assert.strictEqual(trackChangesSpy.callCount, 1);
        const trackChangesParams = trackChangesSpy.getCall(0).args[0];
        assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
        assert.isOk(trackChangesParams.changeList);
        const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Expense
            && updateInstance.get('uuid') === expenseUuid;
        });
        assert.isOk(updateExpense);
        const updateFund1 = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Fund
            && updateInstance.get('uuid') === user1Fund1Uuid;
        });
        assert.isOk(updateFund1);
        const updateFund2 = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Fund
            && updateInstance.get('uuid') === user1Fund2Uuid;
        });
        assert.isOk(updateFund2);
        assert.strictEqual(trackChangesParams.changeList.length, 3);
        assert.isNotOk(trackChangesParams.deleteList);
        assert.isNotOk(trackChangesParams.newList);
        assert.isOk(trackChangesParams.transaction);
      });

      it('should resolve when updating all other attributes', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.updateExpense({
          amount: sampleData.expenses.expense2.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.expenses.expense2.date,
          description: sampleData.expenses.expense2.description,
          expenseUuid,
          fundUuid: user1Fund2Uuid,
          householdMemberUuid: user1HouseholdMember2Uuid,
          reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
          subcategoryUuid: user1Subcategory2Uuid,
          vendorUuid: user1Vendor2Uuid,
        });

        // Verify the Expense instance.
        const expense = await models.Expense.findOne({
          attributes: [
            'amount_cents',
            'date',
            'description',
            'fund_uuid',
            'household_member_uuid',
            'reimbursed_cents',
            'subcategory_uuid',
            'uuid',
            'vendor_uuid',
          ],
          include: [{
            attributes: ['uuid'],
            model: models.HouseholdMember,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Subcategory,
            required: true,
          }, {
            attributes: ['uuid'],
            model: models.Vendor,
            required: true,
          }],
          where: {
            uuid: expenseUuid,
          },
        });
        assert.isOk(expense);
        assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
        assert.strictEqual(expense.get('subcategory_uuid'), user1Subcategory2Uuid);
        assert.strictEqual(expense.Subcategory.get('uuid'), user1Subcategory2Uuid);
        assert.strictEqual(expense.get('date'), sampleData.expenses.expense2.date);
        assert.strictEqual(expense.get('description'), sampleData.expenses.expense2.description);
        assert.strictEqual(expense.get('fund_uuid'), user1Fund2Uuid);
        assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMember2Uuid);
        assert.strictEqual(expense.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);
        assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense2.reimbursed_cents);
        assert.strictEqual(expense.get('vendor_uuid'), user1Vendor2Uuid);
        assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor2Uuid);

        // Verify that Fund 1 was updated.
        const fund1 = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          where: {
            uuid: user1Fund1Uuid,
          },
        });
        assert.isOk(fund1);
        assert.strictEqual(
          fund1.get('balance_cents'),
          FUND1_INITIAL_BALANCE + (
            sampleData.expenses.expense1.amount_cents
              - sampleData.expenses.expense1.reimbursed_cents
          ),
        );

        // Verify that Fund 2 was updated.
        const fund2 = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          where: {
            uuid: user1Fund2Uuid,
          },
        });
        assert.isOk(fund2);
        assert.strictEqual(
          fund2.get('balance_cents'),
          FUND2_INITIAL_BALANCE - (
            sampleData.expenses.expense2.amount_cents
              - sampleData.expenses.expense2.reimbursed_cents
          ),
        );

        assert.strictEqual(trackChangesSpy.callCount, 1);
        const trackChangesParams = trackChangesSpy.getCall(0).args[0];
        assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
        assert.isOk(trackChangesParams.changeList);
        const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Expense
            && updateInstance.get('uuid') === expenseUuid;
        });
        assert.isOk(updateExpense);
        const updateFund1 = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Fund
            && updateInstance.get('uuid') === user1Fund1Uuid;
        });
        assert.isOk(updateFund1);
        const updateFund2 = _.find(trackChangesParams.changeList, (updateInstance) => {
          return updateInstance instanceof models.Fund
            && updateInstance.get('uuid') === user1Fund2Uuid;
        });
        assert.isOk(updateFund2);
        assert.strictEqual(trackChangesParams.changeList.length, 3);
        assert.isNotOk(trackChangesParams.deleteList);
        assert.isNotOk(trackChangesParams.newList);
        assert.isOk(trackChangesParams.transaction);
      });
    });
  });
});
