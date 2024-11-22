import chai from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';
import { LoanError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Controllers - LoanCtrl.createLoanPayment', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdUuid;
  let user1LoanUuid;
  let user1Uuid;
  let user2HouseholdUuid;
  let user2LoanUuid;

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
    user2HouseholdUuid = household.get('uuid');
    await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
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

  it('should reject with no loan UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: null,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
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

  it('should reject with no date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: null,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: 'invalid date',
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no principal amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid principal amount');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid principal amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: 'invalid amount',
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid principal amount');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no interest amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: null,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid interest amount');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid interest amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: 'invalid amount',
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid interest amount');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: null,
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
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
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: uuidv4(),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
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
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
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
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: uuidv4(),
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Loan not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the loan belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanUuid: user2LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Loan not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating a loan payment', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const loanPaymentUuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment1.date,
      interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loanUuid: user1LoanUuid,
      principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
    });

    assert.isOk(loanPaymentUuid);

    // Verify the LoanPayment instance.
    const loanPayment = await models.LoanPayment.findOne({
      attributes: [
        'date',
        'interest_amount_cents',
        'loan_uuid',
        'principal_amount_cents',
        'uuid',
      ],
      where: {
        uuid: loanPaymentUuid,
      },
    });
    assert.isOk(loanPayment);
    assert.strictEqual(loanPayment.get('date'), sampleData.loanPayments.loanPayment1.date);
    assert.strictEqual(loanPayment.get('interest_amount_cents'), sampleData.loanPayments.loanPayment1.interest_amount_cents);
    assert.strictEqual(loanPayment.get('loan_uuid'), user1LoanUuid);
    assert.strictEqual(loanPayment.get('principal_amount_cents'), sampleData.loanPayments.loanPayment1.principal_amount_cents);

    // Verify that the Loan balance was updated.
    const loan = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: loanPayment.get('loan_uuid'),
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('balance_cents'), (sampleData.loans.loan1.amount_cents - sampleData.loanPayments.loanPayment1.principal_amount_cents));

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoan = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === loan.get('uuid');
    });
    assert.isOk(updateLoan);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newLoanPayment = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.LoanPayment
        && newInstance.get('uuid') === loanPayment.get('uuid');
    });
    assert.isOk(newLoanPayment);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });
});
