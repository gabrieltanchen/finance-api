import chai from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';
import { LoanError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Controllers - LoanCtrl.deleteLoanPayment', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdUuid;
  let user1LoanUuid;
  let user1LoanPaymentUuid;
  let user1Uuid;
  let user2HouseholdUuid;
  let user2LoanUuid;
  let user2Uuid;

  const LOAN_INITIAL_BALANCE = 100000;

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

  beforeEach('create user 1 loan', async function() {
    const loan = await models.Loan.create({
      amount_cents: sampleData.loans.loan1.amount_cents,
      balance_cents: LOAN_INITIAL_BALANCE,
      household_uuid: user1HouseholdUuid,
      name: sampleData.loans.loan1.name,
    });
    user1LoanUuid = loan.get('uuid');
  });

  beforeEach('create user 1 loan payment', async function() {
    const loanPayment = await models.LoanPayment.create({
      date: sampleData.loanPayments.loanPayment1.date,
      interest_amount_cents: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loan_uuid: user1LoanUuid,
      principal_amount_cents: sampleData.loanPayments.loanPayment1.principal_amount_cents,
    });
    user1LoanPaymentUuid = loanPayment.get('uuid');
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

  beforeEach('create user 2 loan', async function() {
    const loan = await models.Loan.create({
      amount_cents: sampleData.loans.loan2.amount_cents,
      balance_cents: sampleData.loans.loan2.amount_cents,
      household_uuid: user2HouseholdUuid,
      name: sampleData.loans.loan2.name,
    });
    user2LoanUuid = loan.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no loan payment UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.deleteLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        loanPaymentUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Loan payment is required');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.LoanCtrl.deleteLoanPayment({
        auditApiCallUuid: null,
        loanPaymentUuid: user1LoanPaymentUuid,
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
      await controllers.LoanCtrl.deleteLoanPayment({
        auditApiCallUuid: uuidv4(),
        loanPaymentUuid: user1LoanPaymentUuid,
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
      await controllers.LoanCtrl.deleteLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        loanPaymentUuid: user1LoanPaymentUuid,
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

  it('should reject when the loan payment does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.deleteLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        loanPaymentUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Loan payment not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the loan payment belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.LoanCtrl.deleteLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        loanPaymentUuid: user1LoanPaymentUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Loan payment not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the loan belongs to a different household', async function() {
    try {
      await models.LoanPayment.update({
        loan_uuid: user2LoanUuid,
      }, {
        where: {
          uuid: user1LoanPaymentUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.deleteLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        loanPaymentUuid: user1LoanPaymentUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Loan payment not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve when the loan payment belongs to the user\'s household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.deleteLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      loanPaymentUuid: user1LoanPaymentUuid,
    });

    // Verify that the LoanPayment instance is deleted.
    const loanPayment = await models.LoanPayment.findOne({
      attributes: ['uuid'],
      where: {
        uuid: user1LoanPaymentUuid,
      },
    });
    assert.isNull(loanPayment);

    // Verify that the Loan balance was updated.
    const loan = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('balance_cents'), LOAN_INITIAL_BALANCE + sampleData.loanPayments.loanPayment1.principal_amount_cents);

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
    assert.isOk(trackChangesParams.deleteList);
    const deleteLoanPayment = _.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.LoanPayment
        && deleteInstance.get('uuid') === user1LoanPaymentUuid;
    });
    assert.isOk(deleteLoanPayment);
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
