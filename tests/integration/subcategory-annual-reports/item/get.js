const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /subcategory-annual-reports/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1HouseholdMemberUuid;
  let user1Subcategory1Uuid;
  let user1Subcategory2Uuid;
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

  beforeEach('create user 1 household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
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

  beforeEach('create user 1 subcategory 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    user1Subcategory1Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category2.name,
    });
  });

  beforeEach('create user 1 subcategory 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category3.name,
    });
    user1Subcategory2Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category4.name,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget2.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget3.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense2.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense5.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense5.date,
      description: sampleData.expenses.expense5.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense5.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense8.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense8.date,
      description: sampleData.expenses.expense8.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense8.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
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

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find category.',
      }],
    });
  });

  it('should return 404 when the subcategory is soft deleted', async function() {
    await models.Subcategory.destroy({
      where: {
        uuid: user1Subcategory1Uuid,
      },
    });
    const res = await chai.request(server)
      .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find category.',
      }],
    });
  });

  it('should return 403 with an invalid ID', async function() {
    const res = await chai.request(server)
      .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(403);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Invalid ID provided.',
      }],
    });
  });

  it('should return 200 and no next/previous years with no data in the subcategory', async function() {
    const res = await chai.request(server)
      .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);

    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes['apr-actual'], 0);
    assert.strictEqual(res.body.data.attributes['apr-budget'], 0);
    assert.strictEqual(res.body.data.attributes['aug-actual'], 0);
    assert.strictEqual(res.body.data.attributes['aug-budget'], 0);
    assert.strictEqual(res.body.data.attributes['dec-actual'], 0);
    assert.strictEqual(res.body.data.attributes['dec-budget'], 0);
    assert.strictEqual(res.body.data.attributes['feb-actual'], 0);
    assert.strictEqual(res.body.data.attributes['feb-budget'], 0);
    assert.strictEqual(res.body.data.attributes['has-next-year'], false);
    assert.strictEqual(res.body.data.attributes['has-previous-year'], false);
    assert.strictEqual(res.body.data.attributes['mar-actual'], 0);
    assert.strictEqual(res.body.data.attributes['mar-budget'], 0);
    assert.strictEqual(res.body.data.attributes['may-actual'], 0);
    assert.strictEqual(res.body.data.attributes['may-budget'], 0);
    assert.strictEqual(res.body.data.attributes['jan-actual'], 0);
    assert.strictEqual(res.body.data.attributes['jan-budget'], 0);
    assert.strictEqual(res.body.data.attributes['jul-actual'], 0);
    assert.strictEqual(res.body.data.attributes['jul-budget'], 0);
    assert.strictEqual(res.body.data.attributes['jun-actual'], 0);
    assert.strictEqual(res.body.data.attributes['jun-budget'], 0);
    assert.strictEqual(res.body.data.attributes['nov-actual'], 0);
    assert.strictEqual(res.body.data.attributes['nov-budget'], 0);
    assert.strictEqual(res.body.data.attributes['oct-actual'], 0);
    assert.strictEqual(res.body.data.attributes['oct-budget'], 0);
    assert.strictEqual(res.body.data.attributes['sep-actual'], 0);
    assert.strictEqual(res.body.data.attributes['sep-budget'], 0);
    assert.strictEqual(res.body.data.attributes.year, 2018);
    assert.strictEqual(res.body.data.id, `${user1Subcategory1Uuid}-2018`);
    assert.strictEqual(res.body.data.type, 'subcategory-annual-reports');
  });

  describe('when data exists for the reported year', function() {
    beforeEach('create user 1 subcategory 1 budget 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget4.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 0,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget5.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 1,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget6.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 2,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 4', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget7.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 3,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 5', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget8.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 4,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 6', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget9.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 5,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 7', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget10.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 6,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 8', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget11.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 7,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 9', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget12.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 8,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 10', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget13.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 9,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 11', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget14.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 10,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 12', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget15.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: 11,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2018,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense4.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense4.date,
        description: sampleData.expenses.expense4.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense4.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense7.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense7.date,
        description: sampleData.expenses.expense7.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense7.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 4', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense10.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense10.date,
        description: sampleData.expenses.expense10.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense10.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 5', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense13.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense13.date,
        description: sampleData.expenses.expense13.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense13.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 6', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense16.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense16.date,
        description: sampleData.expenses.expense16.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense16.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 7', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense19.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense19.date,
        description: sampleData.expenses.expense19.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense19.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 8', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense22.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense22.date,
        description: sampleData.expenses.expense22.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense22.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 9', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense25.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense25.date,
        description: sampleData.expenses.expense25.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense25.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 10', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense28.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense28.date,
        description: sampleData.expenses.expense28.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense28.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 11', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense12.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense12.date,
        description: sampleData.expenses.expense12.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense12.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 12', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense15.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense15.date,
        description: sampleData.expenses.expense15.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense15.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 13', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense18.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense18.date,
        description: sampleData.expenses.expense18.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense18.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 14', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense23.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense23.date,
        description: sampleData.expenses.expense23.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense23.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 15', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense27.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense27.date,
        description: sampleData.expenses.expense27.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense27.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    it('should return 200 and the correct totals for the reported year', async function() {
      const res = await chai.request(server)
        .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['apr-actual'], 3296);
      assert.strictEqual(res.body.data.attributes['apr-budget'], 21742);
      assert.strictEqual(res.body.data.attributes['aug-actual'], 44177);
      assert.strictEqual(res.body.data.attributes['aug-budget'], 14156);
      assert.strictEqual(res.body.data.attributes['dec-actual'], 66540);
      assert.strictEqual(res.body.data.attributes['dec-budget'], 20064);
      assert.strictEqual(res.body.data.attributes['feb-actual'], 0);
      assert.strictEqual(res.body.data.attributes['feb-budget'], 28617);
      assert.strictEqual(res.body.data.attributes['has-next-year'], false);
      assert.strictEqual(res.body.data.attributes['has-previous-year'], false);
      assert.strictEqual(res.body.data.attributes['mar-actual'], 181457);
      assert.strictEqual(res.body.data.attributes['mar-budget'], 64671);
      assert.strictEqual(res.body.data.attributes['may-actual'], 65709);
      assert.strictEqual(res.body.data.attributes['may-budget'], 22502);
      assert.strictEqual(res.body.data.attributes['jan-actual'], 60493);
      assert.strictEqual(res.body.data.attributes['jan-budget'], 2926);
      assert.strictEqual(res.body.data.attributes['jul-actual'], 141525);
      assert.strictEqual(res.body.data.attributes['jul-budget'], 75993);
      assert.strictEqual(res.body.data.attributes['jun-actual'], 51316);
      assert.strictEqual(res.body.data.attributes['jun-budget'], 39746);
      assert.strictEqual(res.body.data.attributes['nov-actual'], 0);
      assert.strictEqual(res.body.data.attributes['nov-budget'], 85985);
      assert.strictEqual(res.body.data.attributes['oct-actual'], 285956);
      assert.strictEqual(res.body.data.attributes['oct-budget'], 90756);
      assert.strictEqual(res.body.data.attributes['sep-actual'], 0);
      assert.strictEqual(res.body.data.attributes['sep-budget'], 43294);
      assert.strictEqual(res.body.data.attributes.year, 2018);
      assert.strictEqual(res.body.data.id, `${user1Subcategory1Uuid}-2018`);
      assert.strictEqual(res.body.data.type, 'subcategory-annual-reports');
    });
  });

  describe('when there also exists budgets for the next year', function() {
    beforeEach('create user 1 subcategory 1 budget for next year', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget20.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget20.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    it('should return 200 and has-next-year=true', async function() {
      const res = await chai.request(server)
        .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['has-next-year'], true);
      assert.strictEqual(res.body.data.attributes['has-previous-year'], false);
    });
  });

  describe('when there also exists expenses for the next year', function() {
    beforeEach('create user 1 subcategory expense for next year', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense21.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense21.date.replace('2018', '2019'),
        description: sampleData.expenses.expense21.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense21.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    it('should return 200 and has-next-year=true', async function() {
      const res = await chai.request(server)
        .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['has-next-year'], true);
      assert.strictEqual(res.body.data.attributes['has-previous-year'], false);
    });
  });

  describe('when there also exists budgets for the previous yaer', function() {
    beforeEach('create user 1 subcategory 1 budget for next year', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget21.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget21.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2017,
      });
    });

    it('should return 200 and has-previous-year=true', async function() {
      const res = await chai.request(server)
        .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['has-next-year'], false);
      assert.strictEqual(res.body.data.attributes['has-previous-year'], true);
    });
  });

  describe('when there also exists expenses for the previous year', function() {
    beforeEach('create user 1 subcategory expense for previous year', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense29.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense29.date.replace('2018', '2017'),
        description: sampleData.expenses.expense29.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense29.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    it('should return 200 and has-previous-year=true', async function() {
      const res = await chai.request(server)
        .get(`/subcategory-annual-reports/${user1Subcategory1Uuid}-2018`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['has-next-year'], false);
      assert.strictEqual(res.body.data.attributes['has-previous-year'], true);
    });
  });
});
