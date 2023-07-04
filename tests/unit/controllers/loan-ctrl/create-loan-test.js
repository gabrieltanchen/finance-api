const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { LoanError } = require('../../../../app/middleware/error-handler');
const trackChanges = require('../../../../app/controllers/audit-ctrl/track-changes');

const assert = chai.assert;

describe('Unit:Controllers - LoanCtrl.createLoan', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let userHouseholdUuid;
  let userUuid;

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
    userHouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    userUuid = user.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: userUuid,
      });
      await controllers.LoanCtrl.createLoan({
        amount: sampleData.loans.loan1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
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
        user_uuid: userUuid,
      });
      await controllers.LoanCtrl.createLoan({
        amount: null,
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.loans.loan1.name,
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
        user_uuid: userUuid,
      });
      await controllers.LoanCtrl.createLoan({
        amount: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.loans.loan1.name,
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

  it('should reject with no audit API call', async function() {
    try {
      await controllers.LoanCtrl.createLoan({
        amount: sampleData.loans.loan1.amount_cents,
        auditApiCallUuid: null,
        name: sampleData.loans.loan1.name,
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
      await controllers.LoanCtrl.createLoan({
        amount: sampleData.loans.loan1.amount_cents,
        auditApiCallUuid: uuidv4(),
        name: sampleData.loans.loan1.name,
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
          uuid: userUuid,
        }
      })
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: userUuid,
      });
      await controllers.LoanCtrl.createLoan({
        amount: sampleData.loans.loan1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.loans.loan1.name,
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

  it('should resolve creating a loan', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    const loanUuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan1.name,
    });

    assert.isOk(loanUuid);

    // Verify the Loan instance.
    const loan = await models.Loan.findOne({
      attributes: ['amount_cents', 'balance_cents', 'household_uuid', 'name', 'uuid'],
      where: {
        uuid: loanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('amount_cents'), sampleData.loans.loan1.amount_cents);
    assert.strictEqual(loan.get('household_uuid'), userHouseholdUuid);
    assert.strictEqual(loan.get('name'), sampleData.loans.loan1.name);
    // Should initialize with balance equal to the amount.
    assert.strictEqual(loan.get('balance_cents'), loan.get('amount_cents'));

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newLoan = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Loan
        && newInstance.get('uuid') === loan.get('uuid');
    });
    assert.isOk(newLoan);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });
});
