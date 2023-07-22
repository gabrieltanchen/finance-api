const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { LoanError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - LoanCtrl.updateLoan', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdUuid;
  let user1LoanUuid;
  let user1Uuid;
  let user2Uuid;

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

  this.beforeEach('create loan', async function() {
    const loan = await models.Loan.create({
      amount_cents: sampleData.loans.loan1.amount_cents,
      balance_cents: sampleData.loans.loan1.amount_cents,
      household_uuid: user1HouseholdUuid,
      name: sampleData.loans.loan1.name,
    });
    user1LoanUuid = loan.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user2.lastName,
    });
    const user = await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
    user2Uuid = user.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no loan UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoan({
        amount: sampleData.loans.loan2.amount_cents,
        archived: false,
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: null,
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Loan is required');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoan({
        amount: sampleData.loans.loan2.amount_cents,
        archived: false,
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: user1LoanUuid,
        name: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Name is required');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoan({
        amount: null,
        archived: false,
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: user1LoanUuid,
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoan({
        amount: 'invalid amount',
        archived: false,
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: user1LoanUuid,
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid archived value', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoan({
        amount: sampleData.loans.loan2.amount_cents,
        archived: null,
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: user1LoanUuid,
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid archived value');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.LoanCtrl.updateLoan({
        amount: sampleData.loans.loan2.amount_cents,
        archived: false,
        auditApiCallUuid: null,
        loanUuid: user1LoanUuid,
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.LoanCtrl.updateLoan({
        amount: sampleData.loans.loan2.amount_cents,
        archived: false,
        auditApiCallUuid: uuidv4(),
        loanUuid: user1LoanUuid,
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof LoanError);
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
      await controllers.LoanCtrl.updateLoan({
        amount: sampleData.loans.loan2.amount_cents,
        archived: false,
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: user1LoanUuid,
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the loan does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoan({
        amount: sampleData.loans.loan2.amount_cents,
        archived: false,
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: uuidv4(),
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the loan belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.LoanCtrl.updateLoan({
        amount: sampleData.loans.loan2.amount_cents,
        archived: false,
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: user1LoanUuid,
        name: sampleData.loans.loan2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoan({
      amount: sampleData.loans.loan1.amount_cents,
      archived: false,
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
      name: sampleData.loans.loan1.name,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the name', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoan({
      amount: sampleData.loans.loan1.amount_cents,
      archived: false,
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
      name: sampleData.loans.loan2.name,
    });

    // Verify the Loan instance.
    const loan = await models.Loan.findOne({
      attributes: [
        'amount_cents',
        'archived_at',
        'balance_cents',
        'household_uuid',
        'name',
        'uuid',
      ],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('amount_cents'), sampleData.loans.loan1.amount_cents);
    assert.isNull(loan.get('archived_at'));
    assert.strictEqual(loan.get('balance_cents'), sampleData.loans.loan1.amount_cents);
    assert.strictEqual(loan.get('household_uuid'), user1HouseholdUuid);
    assert.strictEqual(loan.get('name'), sampleData.loans.loan2.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoan = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1LoanUuid;
    });
    assert.isOk(updateLoan);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoan({
      amount: sampleData.loans.loan2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
      name: sampleData.loans.loan1.name,
    });

    // Verify the Loan instance.
    const loan = await models.Loan.findOne({
      attributes: [
        'amount_cents',
        'archived_at',
        'balance_cents',
        'household_uuid',
        'name',
        'uuid',
      ],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('amount_cents'), sampleData.loans.loan2.amount_cents);
    assert.isNull(loan.get('archived_at'));
    assert.strictEqual(loan.get('balance_cents'), sampleData.loans.loan2.amount_cents);
    assert.strictEqual(loan.get('household_uuid'), user1HouseholdUuid);
    assert.strictEqual(loan.get('name'), sampleData.loans.loan1.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoan = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1LoanUuid;
    });
    assert.isOk(updateLoan);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve archiving the loan', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoan({
      amount: sampleData.loans.loan1.amount_cents,
      archived: true,
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
      name: sampleData.loans.loan1.name,
    });

    // Verify the Loan instance.
    const loan = await models.Loan.findOne({
      attributes: [
        'amount_cents',
        'archived_at',
        'balance_cents',
        'household_uuid',
        'name',
        'uuid',
      ],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('amount_cents'), sampleData.loans.loan1.amount_cents);
    assert.isOk(loan.get('archived_at'));
    assert.strictEqual(loan.get('balance_cents'), sampleData.loans.loan1.amount_cents);
    assert.strictEqual(loan.get('household_uuid'), user1HouseholdUuid);
    assert.strictEqual(loan.get('name'), sampleData.loans.loan1.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoan = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1LoanUuid;
    });
    assert.isOk(updateLoan);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve unarchiving the loan', async function() {
    await models.Loan.update({
      archived_at: new Date(),
    }, {
      where: {
        uuid: user1LoanUuid,
      },
    });
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoan({
      amount: sampleData.loans.loan1.amount_cents,
      archived: false,
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
      name: sampleData.loans.loan1.name,
    });

    // Verify the Loan instance.
    const loan = await models.Loan.findOne({
      attributes: [
        'amount_cents',
        'archived_at',
        'balance_cents',
        'household_uuid',
        'name',
        'uuid',
      ],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('amount_cents'), sampleData.loans.loan1.amount_cents);
    assert.isNull(loan.get('archived_at'));
    assert.strictEqual(loan.get('balance_cents'), sampleData.loans.loan1.amount_cents);
    assert.strictEqual(loan.get('household_uuid'), user1HouseholdUuid);
    assert.strictEqual(loan.get('name'), sampleData.loans.loan1.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoan = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1LoanUuid;
    });
    assert.isOk(updateLoan);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating all attributes', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoan({
      amount: sampleData.loans.loan2.amount_cents,
      archived: false,
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
      name: sampleData.loans.loan2.name,
    });

    // Verify the Loan instance.
    const loan = await models.Loan.findOne({
      attributes: [
        'amount_cents',
        'archived_at',
        'balance_cents',
        'household_uuid',
        'name',
        'uuid',
      ],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('amount_cents'), sampleData.loans.loan2.amount_cents);
    assert.isNull(loan.get('archived_at'));
    assert.strictEqual(loan.get('balance_cents'), sampleData.loans.loan2.amount_cents);
    assert.strictEqual(loan.get('household_uuid'), user1HouseholdUuid);
    assert.strictEqual(loan.get('name'), sampleData.loans.loan2.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoan = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1LoanUuid;
    });
    assert.isOk(updateLoan);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should recalculate the balance when increasing the loan amount', async function() {
    await models.Loan.update({
      amount_cents: 500,
      balance_cents: 250,
    }, {
      where: {
        uuid: user1LoanUuid,
      },
    });
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoan({
      amount: 600,
      archived: false,
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
      name: sampleData.loans.loan1.name,
    });

    // Verify the Loan instance.
    const loan = await models.Loan.findOne({
      attributes: ['amount_cents', 'balance_cents', 'uuid'],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('amount_cents'), 600);
    assert.strictEqual(loan.get('balance_cents'), 350);
  });

  it('should recalculate the balance when decreasing the loan amount', async function() {
    await models.Loan.update({
      amount_cents: 500,
      balance_cents: 250,
    }, {
      where: {
        uuid: user1LoanUuid,
      },
    });
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoan({
      amount: 400,
      archived: false,
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
      name: sampleData.loans.loan1.name,
    });

    // Verify the Loan instance.
    const loan = await models.Loan.findOne({
      attributes: ['amount_cents', 'balance_cents', 'uuid'],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('amount_cents'), 400);
    assert.strictEqual(loan.get('balance_cents'), 150);
  });
});
