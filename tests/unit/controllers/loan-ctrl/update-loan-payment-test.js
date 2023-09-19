const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { LoanError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - LoanCtrl.updateLoanPayment', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdUuid;
  let user1Loan1Uuid;
  let user1Loan2Uuid;
  let user1LoanPaymentUuid;
  let user1Uuid;
  let user2HouseholdUuid;
  let user2Loan1Uuid;
  let user2Loan2Uuid;
  let user2Uuid;

  const LOAN1_INITIAL_BALANCE = 100000;
  const LOAN2_INITIAL_BALANCE = 150000;

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

  beforeEach('create user 1 loan 1', async function() {
    const loan = await models.Loan.create({
      amount_cents: sampleData.loans.loan1.amount_cents,
      balance_cents: LOAN1_INITIAL_BALANCE,
      household_uuid: user1HouseholdUuid,
      name: sampleData.loans.loan1.name,
    });
    user1Loan1Uuid = loan.get('uuid');
  });

  beforeEach('create user 1 loan 2', async function() {
    const loan = await models.Loan.create({
      amount_cents: sampleData.loans.loan2.amount_cents,
      balance_cents: LOAN2_INITIAL_BALANCE,
      household_uuid: user1HouseholdUuid,
      name: sampleData.loans.loan2.name,
    });
    user1Loan2Uuid = loan.get('uuid');
  });

  beforeEach('create user 1 loan payment', async function() {
    const loanPayment = await models.LoanPayment.create({
      date: sampleData.loanPayments.loanPayment1.date,
      interest_amount_cents: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loan_uuid: user1Loan1Uuid,
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

  beforeEach('create user 2 loan 1', async function() {
    const loan = await models.Loan.create({
      amount_cents: sampleData.loans.loan3.amount_cents,
      balance_cents: sampleData.loans.loan3.amount_cents,
      household_uuid: user2HouseholdUuid,
      name: sampleData.loans.loan3.name,
    });
    user2Loan1Uuid = loan.get('uuid');
  });

  beforeEach('create user 2 loan 2', async function() {
    const loan = await models.Loan.create({
      amount_cents: sampleData.loans.loan4.amount_cents,
      balance_cents: sampleData.loans.loan4.amount_cents,
      household_uuid: user2HouseholdUuid,
      name: sampleData.loans.loan4.name,
    });
    user2Loan2Uuid = loan.get('uuid');
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: null,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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

  it('should reject with no loan UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: null,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: null,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: 'Invalid date',
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: 'invalid',
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: null,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: 'invalid',
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: null,
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: uuidv4(),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: uuidv4(),
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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
        loan_uuid: user2Loan1Uuid,
      }, {
        where: {
          uuid: user1LoanPaymentUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user1Loan2Uuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
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

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment1.date,
      interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loanPaymentUuid: user1LoanPaymentUuid,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the principal amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment1.date,
      interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loanPaymentUuid: user1LoanPaymentUuid,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
    });

    // Verify the LoanPayment instance.
    const loanPayment = await models.LoanPayment.findOne({
      attributes: [
        'date',
        'interest_amount_cents',
        'loan_uuid',
        'principal_amount_cents',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Loan,
        required: true,
      }],
      where: {
        uuid: user1LoanPaymentUuid,
      },
    });
    assert.isOk(loanPayment);
    assert.strictEqual(loanPayment.get('date'), sampleData.loanPayments.loanPayment1.date);
    assert.strictEqual(loanPayment.get('interest_amount_cents'), sampleData.loanPayments.loanPayment1.interest_amount_cents);
    assert.strictEqual(loanPayment.get('loan_uuid'), user1Loan1Uuid);
    assert.strictEqual(loanPayment.Loan.get('uuid'), user1Loan1Uuid);
    assert.strictEqual(loanPayment.get('principal_amount_cents'), sampleData.loanPayments.loanPayment2.principal_amount_cents);

    // Verify that the Loan balance was updated.
    const loan = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: loanPayment.get('loan_uuid'),
      },
    });
    assert.isOk(loan);
    const principalDifference = sampleData.loanPayments.loanPayment2.principal_amount_cents
      - sampleData.loanPayments.loanPayment1.principal_amount_cents;
    assert.strictEqual(loan.get('balance_cents'), (LOAN1_INITIAL_BALANCE - principalDifference));

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoanPayment = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.LoanPayment
        && updateInstance.get('uuid') === user1LoanPaymentUuid;
    });
    assert.isOk(updateLoanPayment);
    const updateLoan = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1Loan1Uuid;
    });
    assert.isOk(updateLoan);
    assert.strictEqual(trackChangesParams.changeList.length, 2);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the interest amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment1.date,
      interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
      loanPaymentUuid: user1LoanPaymentUuid,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
    });

    // Verify the LoanPayment instance.
    const loanPayment = await models.LoanPayment.findOne({
      attributes: [
        'date',
        'interest_amount_cents',
        'loan_uuid',
        'principal_amount_cents',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Loan,
        required: true,
      }],
      where: {
        uuid: user1LoanPaymentUuid,
      },
    });
    assert.isOk(loanPayment);
    assert.strictEqual(loanPayment.get('date'), sampleData.loanPayments.loanPayment1.date);
    assert.strictEqual(loanPayment.get('interest_amount_cents'), sampleData.loanPayments.loanPayment2.interest_amount_cents);
    assert.strictEqual(loanPayment.get('loan_uuid'), user1Loan1Uuid);
    assert.strictEqual(loanPayment.Loan.get('uuid'), user1Loan1Uuid);
    assert.strictEqual(loanPayment.get('principal_amount_cents'), sampleData.loanPayments.loanPayment1.principal_amount_cents);

    // Verify that the Loan balance wasn't updated.
    const loan = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: loanPayment.get('loan_uuid'),
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('balance_cents'), LOAN1_INITIAL_BALANCE);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoanPayment = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.LoanPayment
        && updateInstance.get('uuid') === user1LoanPaymentUuid;
    });
    assert.isOk(updateLoanPayment);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the date', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment2.date,
      interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loanPaymentUuid: user1LoanPaymentUuid,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
    });

    // Verify the LoanPayment instance.
    const loanPayment = await models.LoanPayment.findOne({
      attributes: [
        'date',
        'interest_amount_cents',
        'loan_uuid',
        'principal_amount_cents',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Loan,
        required: true,
      }],
      where: {
        uuid: user1LoanPaymentUuid,
      },
    });
    assert.isOk(loanPayment);
    assert.strictEqual(loanPayment.get('date'), sampleData.loanPayments.loanPayment2.date);
    assert.strictEqual(loanPayment.get('interest_amount_cents'), sampleData.loanPayments.loanPayment1.interest_amount_cents);
    assert.strictEqual(loanPayment.get('loan_uuid'), user1Loan1Uuid);
    assert.strictEqual(loanPayment.Loan.get('uuid'), user1Loan1Uuid);
    assert.strictEqual(loanPayment.get('principal_amount_cents'), sampleData.loanPayments.loanPayment1.principal_amount_cents);

    // Verify that the Loan balance wasn't updated.
    const loan = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: loanPayment.get('loan_uuid'),
      },
    });
    assert.isOk(loan);
    assert.strictEqual(loan.get('balance_cents'), LOAN1_INITIAL_BALANCE);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoanPayment = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.LoanPayment
        && updateInstance.get('uuid') === user1LoanPaymentUuid;
    });
    assert.isOk(updateLoanPayment);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the loan when it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
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

  it('should reject updating the loan when it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment1.date,
        interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
        loanPaymentUuid: user1LoanPaymentUuid,
        loanUuid: user2Loan2Uuid,
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

  it('should resolve updating the loan', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment1.date,
      interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loanPaymentUuid: user1LoanPaymentUuid,
      loanUuid: user1Loan2Uuid,
      principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
    });

    // Verify the LoanPayment instance.
    const loanPayment = await models.LoanPayment.findOne({
      attributes: [
        'date',
        'interest_amount_cents',
        'loan_uuid',
        'principal_amount_cents',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Loan,
        required: true,
      }],
      where: {
        uuid: user1LoanPaymentUuid,
      },
    });
    assert.isOk(loanPayment);
    assert.strictEqual(loanPayment.get('date'), sampleData.loanPayments.loanPayment1.date);
    assert.strictEqual(loanPayment.get('interest_amount_cents'), sampleData.loanPayments.loanPayment1.interest_amount_cents);
    assert.strictEqual(loanPayment.get('loan_uuid'), user1Loan2Uuid);
    assert.strictEqual(loanPayment.Loan.get('uuid'), user1Loan2Uuid);
    assert.strictEqual(loanPayment.get('principal_amount_cents'), sampleData.loanPayments.loanPayment1.principal_amount_cents);

    // Verify that Loan 1 was updated.
    const loan1 = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: user1Loan1Uuid,
      },
    });
    assert.isOk(loan1);
    assert.strictEqual(loan1.get('balance_cents'), LOAN1_INITIAL_BALANCE + sampleData.loanPayments.loanPayment1.principal_amount_cents);

    // Verify that Loan 2 was updated.
    const loan2 = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: user1Loan2Uuid,
      },
    });
    assert.isOk(loan2);
    assert.strictEqual(loan2.get('balance_cents'), LOAN2_INITIAL_BALANCE - sampleData.loanPayments.loanPayment1.principal_amount_cents);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoanPayment = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.LoanPayment
        && updateInstance.get('uuid') === user1LoanPaymentUuid;
    });
    assert.isOk(updateLoanPayment);
    const updateLoan1 = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1Loan1Uuid;
    });
    assert.isOk(updateLoan1);
    const updateLoan2 = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1Loan2Uuid;
    });
    assert.isOk(updateLoan2);
    assert.strictEqual(trackChangesParams.changeList.length, 3);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating all attributes', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.updateLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment2.date,
      interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
      loanPaymentUuid: user1LoanPaymentUuid,
      loanUuid: user1Loan2Uuid,
      principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
    });

    // Verify the LoanPayment instance.
    const loanPayment = await models.LoanPayment.findOne({
      attributes: [
        'date',
        'interest_amount_cents',
        'loan_uuid',
        'principal_amount_cents',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Loan,
        required: true,
      }],
      where: {
        uuid: user1LoanPaymentUuid,
      },
    });
    assert.isOk(loanPayment);
    assert.strictEqual(loanPayment.get('date'), sampleData.loanPayments.loanPayment2.date);
    assert.strictEqual(loanPayment.get('interest_amount_cents'), sampleData.loanPayments.loanPayment2.interest_amount_cents);
    assert.strictEqual(loanPayment.get('loan_uuid'), user1Loan2Uuid);
    assert.strictEqual(loanPayment.Loan.get('uuid'), user1Loan2Uuid);
    assert.strictEqual(loanPayment.get('principal_amount_cents'), sampleData.loanPayments.loanPayment2.principal_amount_cents);

    // Verify that Loan 1 was updated.
    const loan1 = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: user1Loan1Uuid,
      },
    });
    assert.isOk(loan1);
    assert.strictEqual(loan1.get('balance_cents'), LOAN1_INITIAL_BALANCE + sampleData.loanPayments.loanPayment1.principal_amount_cents);

    // Verify that Loan 2 was updated.
    const loan2 = await models.Loan.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: user1Loan2Uuid,
      },
    });
    assert.isOk(loan2);
    assert.strictEqual(loan2.get('balance_cents'), LOAN2_INITIAL_BALANCE - sampleData.loanPayments.loanPayment2.principal_amount_cents);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateLoanPayment = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.LoanPayment
        && updateInstance.get('uuid') === user1LoanPaymentUuid;
    });
    assert.isOk(updateLoanPayment);
    const updateLoan1 = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1Loan1Uuid;
    });
    assert.isOk(updateLoan1);
    const updateLoan2 = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Loan
        && updateInstance.get('uuid') === user1Loan2Uuid;
    });
    assert.isOk(updateLoan2);
    assert.strictEqual(trackChangesParams.changeList.length, 3);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
