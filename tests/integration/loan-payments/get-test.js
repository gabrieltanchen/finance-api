import chai from 'chai';
import chaiHttp from 'chai-http';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../sample-data/index.js';
import TestHelper from '../../test-helper/index.js';

const assert = chai.assert;
const expect = chai.expect;

const validateLoanPayment = ({
  expectedLoanPayment,
  loanPaymentUuid,
  loanUuid,
  returnedLoanPayment,
}) => {
  assert.isOk(returnedLoanPayment.attributes);
  assert.isOk(returnedLoanPayment.attributes['created-at']);
  assert.strictEqual(returnedLoanPayment.attributes.date, expectedLoanPayment.date);
  assert.strictEqual(returnedLoanPayment.attributes['interest-amount'], expectedLoanPayment.interest_amount_cents);
  assert.strictEqual(returnedLoanPayment.attributes['principal-amount'], expectedLoanPayment.principal_amount_cents);
  assert.strictEqual(returnedLoanPayment.id, loanPaymentUuid);
  assert.isOk(returnedLoanPayment.relationships);
  assert.isOk(returnedLoanPayment.relationships.loan);
  assert.isOk(returnedLoanPayment.relationships.loan.data);
  assert.strictEqual(returnedLoanPayment.relationships.loan.data.id, loanUuid);
  assert.strictEqual(returnedLoanPayment.relationships.loan.data.type, 'loans');
  assert.strictEqual(returnedLoanPayment.type, 'loan-payments');
};

chai.use(chaiHttp);

describe('Integration - GET /loan-payments', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1Loan1Uuid;
  let user1Loan2Uuid;
  let user1LoanPayment1Uuid;
  let user1LoanPayment2Uuid;
  let user1LoanPayment3Uuid;
  let user1LoanPayment4Uuid;
  let user1LoanPayment5Uuid;
  let user1LoanPayment6Uuid;
  let user1LoanPayment7Uuid;
  let user1LoanPayment8Uuid;
  let user1LoanPayment9Uuid;
  let user1LoanPayment10Uuid;
  let user1LoanPayment11Uuid;
  let user1LoanPayment12Uuid;
  let user1LoanPayment13Uuid;
  let user1LoanPayment14Uuid;
  let user1LoanPayment15Uuid;
  let user1LoanPayment16Uuid;
  let user1LoanPayment17Uuid;
  let user1LoanPayment18Uuid;
  let user1LoanPayment19Uuid;
  let user1LoanPayment20Uuid;
  let user1LoanPayment21Uuid;
  let user1LoanPayment22Uuid;
  let user1LoanPayment23Uuid;
  let user1LoanPayment24Uuid;
  let user1LoanPayment25Uuid;
  let user1LoanPayment26Uuid;
  let user1LoanPayment27Uuid;
  let user1LoanPayment28Uuid;
  let user1Token;
  let user1Uuid;
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

  before('create user 1 loan 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan1Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan1.name,
    });
  });

  before('create user 1 loan 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan2Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan2.name,
    });
  });

  before('create user 1 loan payment 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment1Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment1.date,
      interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment2Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment2.date,
      interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment3Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment3.date,
      interestAmount: sampleData.loanPayments.loanPayment3.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment3.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment4Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment4.date,
      interestAmount: sampleData.loanPayments.loanPayment4.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment4.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment5Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment5.date,
      interestAmount: sampleData.loanPayments.loanPayment5.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment5.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment6Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment6.date,
      interestAmount: sampleData.loanPayments.loanPayment6.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment6.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment7Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment7.date,
      interestAmount: sampleData.loanPayments.loanPayment7.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment7.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment8Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment8.date,
      interestAmount: sampleData.loanPayments.loanPayment8.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment8.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment9Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment9.date,
      interestAmount: sampleData.loanPayments.loanPayment9.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment9.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment10Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment10.date,
      interestAmount: sampleData.loanPayments.loanPayment10.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment10.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment11Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment11.date,
      interestAmount: sampleData.loanPayments.loanPayment11.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment11.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment12Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment12.date,
      interestAmount: sampleData.loanPayments.loanPayment12.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment12.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment13Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment13.date,
      interestAmount: sampleData.loanPayments.loanPayment13.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment13.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment14Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment14.date,
      interestAmount: sampleData.loanPayments.loanPayment14.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment14.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment15Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment15.date,
      interestAmount: sampleData.loanPayments.loanPayment15.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment15.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment16Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment16.date,
      interestAmount: sampleData.loanPayments.loanPayment16.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment16.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment17Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment17.date,
      interestAmount: sampleData.loanPayments.loanPayment17.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment17.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment18Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment18.date,
      interestAmount: sampleData.loanPayments.loanPayment18.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment18.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment19Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment19.date,
      interestAmount: sampleData.loanPayments.loanPayment19.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment19.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment20Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment20.date,
      interestAmount: sampleData.loanPayments.loanPayment20.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment20.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment21Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment21.date,
      interestAmount: sampleData.loanPayments.loanPayment21.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment21.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment22Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment22.date,
      interestAmount: sampleData.loanPayments.loanPayment22.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment22.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment23Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment23.date,
      interestAmount: sampleData.loanPayments.loanPayment23.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment23.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment24Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment24.date,
      interestAmount: sampleData.loanPayments.loanPayment24.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment24.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment25Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment25.date,
      interestAmount: sampleData.loanPayments.loanPayment25.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment25.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment26Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment26.date,
      interestAmount: sampleData.loanPayments.loanPayment26.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment26.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment27Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment27.date,
      interestAmount: sampleData.loanPayments.loanPayment27.interest_amount_cents,
      loanUuid: user1Loan1Uuid,
      principalAmount: sampleData.loanPayments.loanPayment27.principal_amount_cents,
    });
  });

  before('create user 1 loan payment 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPayment28Uuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment28.date,
      interestAmount: sampleData.loanPayments.loanPayment28.interest_amount_cents,
      loanUuid: user1Loan2Uuid,
      principalAmount: sampleData.loanPayments.loanPayment28.principal_amount_cents,
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
      .get('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 403 with no loan id', async function() {
    const res = await chai.request(server)
      .get('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(403);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Loan ID is required.',
      }],
    });
  });

  describe('when called with the loan_id query param', function() {
    it('should return 404 when the loan does not exist', async function() {
      const res = await chai.request(server)
        .get(`/loan-payments?loan_id=${uuidv4()}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find loan.',
        }],
      });
    });

    it('should return 404 when the loan belongs to a different household', async function() {
      const res = await chai.request(server)
        .get(`/loan-payments?loan_id=${user1Loan1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find loan.',
        }],
      });
    });

    it('should return 200 and 25 loan payments as user 1 with loan 1 and no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/loan-payments?loan_id=${user1Loan1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Loan Payment 27
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment27,
        loanPaymentUuid: user1LoanPayment27Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[0],
      });

      // Loan Payment 26
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment26,
        loanPaymentUuid: user1LoanPayment26Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[1],
      });

      // Loan Payment 25
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment25,
        loanPaymentUuid: user1LoanPayment25Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[2],
      });

      // Loan Payment 24
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment24,
        loanPaymentUuid: user1LoanPayment24Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[3],
      });

      // Loan Payment 23
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment23,
        loanPaymentUuid: user1LoanPayment23Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[4],
      });

      // Loan Payment 22
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment22,
        loanPaymentUuid: user1LoanPayment22Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[5],
      });

      // Loan Payment 21
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment21,
        loanPaymentUuid: user1LoanPayment21Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[6],
      });

      // Loan Payment 20
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment20,
        loanPaymentUuid: user1LoanPayment20Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[7],
      });

      // Loan Payment 19
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment19,
        loanPaymentUuid: user1LoanPayment19Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[8],
      });

      // Loan Payment 18
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment18,
        loanPaymentUuid: user1LoanPayment18Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[9],
      });

      // Loan Payment 17
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment17,
        loanPaymentUuid: user1LoanPayment17Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[10],
      });

      // Loan Payment 16
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment16,
        loanPaymentUuid: user1LoanPayment16Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[11],
      });

      // Loan Payment 15
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment15,
        loanPaymentUuid: user1LoanPayment15Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[12],
      });

      // Loan Payment 14
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment14,
        loanPaymentUuid: user1LoanPayment14Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[13],
      });

      // Loan Payment 13
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment13,
        loanPaymentUuid: user1LoanPayment13Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[14],
      });

      // Loan Payment 12
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment12,
        loanPaymentUuid: user1LoanPayment12Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[15],
      });

      // Loan Payment 11
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment11,
        loanPaymentUuid: user1LoanPayment11Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[16],
      });

      // Loan Payment 10
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment10,
        loanPaymentUuid: user1LoanPayment10Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[17],
      });

      // Loan Payment 9
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment9,
        loanPaymentUuid: user1LoanPayment9Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[18],
      });

      // Loan Payment 8
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment8,
        loanPaymentUuid: user1LoanPayment8Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[19],
      });

      // Loan Payment 7
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment7,
        loanPaymentUuid: user1LoanPayment7Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[20],
      });

      // Loan Payment 6
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment6,
        loanPaymentUuid: user1LoanPayment6Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[21],
      });

      // Loan Payment 5
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment5,
        loanPaymentUuid: user1LoanPayment5Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[22],
      });

      // Loan Payment 4
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment4,
        loanPaymentUuid: user1LoanPayment4Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[23],
      });

      // Loan Payment 3
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment3,
        loanPaymentUuid: user1LoanPayment3Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[24],
      });

      assert.isOk(res.body.included);
      const loanInclude = _.find(res.body.included, (include) => {
        return include.id === user1Loan1Uuid
          && include.type === 'loans';
      });
      assert.isOk(loanInclude);
      assert.isOk(loanInclude.attributes);
      assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 loan payments as user 1 with loan 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/loan-payments?loan_id=${user1Loan1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Loan Payment 2
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment2,
        loanPaymentUuid: user1LoanPayment2Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[0],
      });

      // Loan Payment 1
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment1,
        loanPaymentUuid: user1LoanPayment1Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[1],
      });

      assert.isOk(res.body.included);
      const loanInclude = _.find(res.body.included, (include) => {
        return include.id === user1Loan1Uuid
          && include.type === 'loans';
      });
      assert.isOk(loanInclude);
      assert.isOk(loanInclude.attributes);
      assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 loan payments as user 1 with loan 1 limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/loan-payments?loan_id=${user1Loan1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Loan Payment 12
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment12,
        loanPaymentUuid: user1LoanPayment12Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[0],
      });

      // Loan Payment 11
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment11,
        loanPaymentUuid: user1LoanPayment11Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[1],
      });

      // Loan Payment 10
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment10,
        loanPaymentUuid: user1LoanPayment10Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[2],
      });

      // Loan Payment 9
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment9,
        loanPaymentUuid: user1LoanPayment9Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[3],
      });

      // Loan Payment 8
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment8,
        loanPaymentUuid: user1LoanPayment8Uuid,
        loanUuid: user1Loan1Uuid,
        returnedLoanPayment: res.body.data[4],
      });

      assert.isOk(res.body.included);
      const loanInclude = _.find(res.body.included, (include) => {
        return include.id === user1Loan1Uuid
          && include.type === 'loans';
      });
      assert.isOk(loanInclude);
      assert.isOk(loanInclude.attributes);
      assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 loan payment as user 1 with loan 2', async function() {
      const res = await chai.request(server)
        .get(`/loan-payments?loan_id=${user1Loan2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Loan Payment 28
      validateLoanPayment({
        expectedLoanPayment: sampleData.loanPayments.loanPayment28,
        loanPaymentUuid: user1LoanPayment28Uuid,
        loanUuid: user1Loan2Uuid,
        returnedLoanPayment: res.body.data[0],
      });

      assert.isOk(res.body.included);
      const loanInclude = _.find(res.body.included, (include) => {
        return include.id === user1Loan2Uuid
          && include.type === 'loans';
      });
      assert.isOk(loanInclude);
      assert.isOk(loanInclude.attributes);
      assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });

    describe('with loan 1 and sort=date and sortDirection=asc', function() {
      it('should return 200 and 25 loan payments as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=date&sortDirection=asc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Loan Payment 1
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment1,
          loanPaymentUuid: user1LoanPayment1Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 2
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment2,
          loanPaymentUuid: user1LoanPayment2Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 3
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment3,
          loanPaymentUuid: user1LoanPayment3Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 4
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment4,
          loanPaymentUuid: user1LoanPayment4Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 5
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment5,
          loanPaymentUuid: user1LoanPayment5Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        // Loan Payment 6
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment6,
          loanPaymentUuid: user1LoanPayment6Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[5],
        });

        // Loan Payment 7
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment7,
          loanPaymentUuid: user1LoanPayment7Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[6],
        });

        // Loan Payment 8
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment8,
          loanPaymentUuid: user1LoanPayment8Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[7],
        });

        // Loan Payment 9
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment9,
          loanPaymentUuid: user1LoanPayment9Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[8],
        });

        // Loan Payment 10
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment10,
          loanPaymentUuid: user1LoanPayment10Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[9],
        });

        // Loan Payment 11
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment11,
          loanPaymentUuid: user1LoanPayment11Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[10],
        });

        // Loan Payment 12
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment12,
          loanPaymentUuid: user1LoanPayment12Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[11],
        });

        // Loan Payment 13
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment13,
          loanPaymentUuid: user1LoanPayment13Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[12],
        });

        // Loan Payment 14
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment14,
          loanPaymentUuid: user1LoanPayment14Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[13],
        });

        // Loan Payment 15
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment15,
          loanPaymentUuid: user1LoanPayment15Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[14],
        });

        // Loan Payment 16
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment16,
          loanPaymentUuid: user1LoanPayment16Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[15],
        });

        // Loan Payment 17
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment17,
          loanPaymentUuid: user1LoanPayment17Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[16],
        });

        // Loan Payment 18
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment18,
          loanPaymentUuid: user1LoanPayment18Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[17],
        });

        // Loan Payment 19
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment19,
          loanPaymentUuid: user1LoanPayment19Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[18],
        });

        // Loan Payment 20
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment20,
          loanPaymentUuid: user1LoanPayment20Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[19],
        });

        // Loan Payment 21
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment21,
          loanPaymentUuid: user1LoanPayment21Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[20],
        });

        // Loan Payment 22
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment22,
          loanPaymentUuid: user1LoanPayment22Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[21],
        });

        // Loan Payment 23
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment23,
          loanPaymentUuid: user1LoanPayment23Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[22],
        });

        // Loan Payment 24
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment24,
          loanPaymentUuid: user1LoanPayment24Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[23],
        });

        // Loan Payment 25
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment25,
          loanPaymentUuid: user1LoanPayment25Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 loan payments as user 1 with no limit and page=2', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=date&sortDirection=asc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Loan Payment 26
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment26,
          loanPaymentUuid: user1LoanPayment26Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 27
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment27,
          loanPaymentUuid: user1LoanPayment27Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 loan payments with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=date&sortDirection=asc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Loan Payment 16
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment16,
          loanPaymentUuid: user1LoanPayment16Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 17
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment17,
          loanPaymentUuid: user1LoanPayment17Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 18
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment18,
          loanPaymentUuid: user1LoanPayment18Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 19
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment19,
          loanPaymentUuid: user1LoanPayment19Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 20
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment20,
          loanPaymentUuid: user1LoanPayment20Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });

    describe('with loan 1 and sort=date and sortDirection=desc', function() {
      it('should return 200 and 25 loan payments as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=date&sortDirection=desc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Loan Payment 27
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment27,
          loanPaymentUuid: user1LoanPayment27Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 26
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment26,
          loanPaymentUuid: user1LoanPayment26Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 25
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment25,
          loanPaymentUuid: user1LoanPayment25Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 24
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment24,
          loanPaymentUuid: user1LoanPayment24Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 23
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment23,
          loanPaymentUuid: user1LoanPayment23Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        // Loan Payment 22
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment22,
          loanPaymentUuid: user1LoanPayment22Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[5],
        });

        // Loan Payment 21
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment21,
          loanPaymentUuid: user1LoanPayment21Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[6],
        });

        // Loan Payment 20
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment20,
          loanPaymentUuid: user1LoanPayment20Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[7],
        });

        // Loan Payment 19
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment19,
          loanPaymentUuid: user1LoanPayment19Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[8],
        });

        // Loan Payment 18
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment18,
          loanPaymentUuid: user1LoanPayment18Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[9],
        });

        // Loan Payment 17
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment17,
          loanPaymentUuid: user1LoanPayment17Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[10],
        });

        // Loan Payment 16
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment16,
          loanPaymentUuid: user1LoanPayment16Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[11],
        });

        // Loan Payment 15
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment15,
          loanPaymentUuid: user1LoanPayment15Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[12],
        });

        // Loan Payment 14
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment14,
          loanPaymentUuid: user1LoanPayment14Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[13],
        });

        // Loan Payment 13
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment13,
          loanPaymentUuid: user1LoanPayment13Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[14],
        });

        // Loan Payment 12
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment12,
          loanPaymentUuid: user1LoanPayment12Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[15],
        });

        // Loan Payment 11
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment11,
          loanPaymentUuid: user1LoanPayment11Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[16],
        });

        // Loan Payment 10
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment10,
          loanPaymentUuid: user1LoanPayment10Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[17],
        });

        // Loan Payment 9
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment9,
          loanPaymentUuid: user1LoanPayment9Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[18],
        });

        // Loan Payment 8
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment8,
          loanPaymentUuid: user1LoanPayment8Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[19],
        });

        // Loan Payment 7
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment7,
          loanPaymentUuid: user1LoanPayment7Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[20],
        });

        // Loan Payment 6
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment6,
          loanPaymentUuid: user1LoanPayment6Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[21],
        });

        // Loan Payment 5
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment5,
          loanPaymentUuid: user1LoanPayment5Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[22],
        });

        // Loan Payment 4
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment4,
          loanPaymentUuid: user1LoanPayment4Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[23],
        });

        // Loan Payment 3
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment3,
          loanPaymentUuid: user1LoanPayment3Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 loan payments as user 1 with no limit and page=2', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=date&sortDirection=desc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Loan Payment 2
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment2,
          loanPaymentUuid: user1LoanPayment2Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 1
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment1,
          loanPaymentUuid: user1LoanPayment1Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 loan payments with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=date&sortDirection=desc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Loan Payment 12
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment12,
          loanPaymentUuid: user1LoanPayment12Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 11
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment11,
          loanPaymentUuid: user1LoanPayment11Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 10
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment10,
          loanPaymentUuid: user1LoanPayment10Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 9
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment9,
          loanPaymentUuid: user1LoanPayment9Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 8
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment8,
          loanPaymentUuid: user1LoanPayment8Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });

    describe('with loan 1 and sort=principal_amount and sortDirection=asc', function() {
      it('should return 200 and 25 loan payments as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=principal_amount&sortDirection=asc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Loan Payment 2
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment2,
          loanPaymentUuid: user1LoanPayment2Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 19
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment19,
          loanPaymentUuid: user1LoanPayment19Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 23
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment23,
          loanPaymentUuid: user1LoanPayment23Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 4
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment4,
          loanPaymentUuid: user1LoanPayment4Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 15
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment15,
          loanPaymentUuid: user1LoanPayment15Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        // Loan Payment 17
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment17,
          loanPaymentUuid: user1LoanPayment17Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[5],
        });

        // Loan Payment 20
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment20,
          loanPaymentUuid: user1LoanPayment20Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[6],
        });

        // Loan Payment 11
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment11,
          loanPaymentUuid: user1LoanPayment11Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[7],
        });

        // Loan Payment 21
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment21,
          loanPaymentUuid: user1LoanPayment21Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[8],
        });

        // Loan Payment 7
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment7,
          loanPaymentUuid: user1LoanPayment7Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[9],
        });

        // Loan Payment 6
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment6,
          loanPaymentUuid: user1LoanPayment6Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[10],
        });

        // Loan Payment 18
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment18,
          loanPaymentUuid: user1LoanPayment18Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[11],
        });

        // Loan Payment 9
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment9,
          loanPaymentUuid: user1LoanPayment9Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[12],
        });

        // Loan Payment 3
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment3,
          loanPaymentUuid: user1LoanPayment3Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[13],
        });

        // Loan Payment 10
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment10,
          loanPaymentUuid: user1LoanPayment10Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[14],
        });

        // Loan Payment 22
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment22,
          loanPaymentUuid: user1LoanPayment22Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[15],
        });

        // Loan Payment 13
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment13,
          loanPaymentUuid: user1LoanPayment13Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[16],
        });

        // Loan Payment 24
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment24,
          loanPaymentUuid: user1LoanPayment24Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[17],
        });

        // Loan Payment 26
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment26,
          loanPaymentUuid: user1LoanPayment26Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[18],
        });

        // Loan Payment 12
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment12,
          loanPaymentUuid: user1LoanPayment12Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[19],
        });

        // Loan Payment 16
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment16,
          loanPaymentUuid: user1LoanPayment16Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[20],
        });

        // Loan Payment 25
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment25,
          loanPaymentUuid: user1LoanPayment25Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[21],
        });

        // Loan Payment 1
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment1,
          loanPaymentUuid: user1LoanPayment1Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[22],
        });

        // Loan Payment 8
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment8,
          loanPaymentUuid: user1LoanPayment8Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[23],
        });

        // Loan Payment 14
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment14,
          loanPaymentUuid: user1LoanPayment14Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 loan payments as user 1 with no limit and page=2', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=principal_amount&sortDirection=asc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Loan Payment 5
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment5,
          loanPaymentUuid: user1LoanPayment5Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 27
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment27,
          loanPaymentUuid: user1LoanPayment27Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 loan payments with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=principal_amount&sortDirection=asc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Loan Payment 22
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment22,
          loanPaymentUuid: user1LoanPayment22Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 13
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment13,
          loanPaymentUuid: user1LoanPayment13Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 24
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment24,
          loanPaymentUuid: user1LoanPayment24Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 26
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment26,
          loanPaymentUuid: user1LoanPayment26Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 12
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment12,
          loanPaymentUuid: user1LoanPayment12Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });

    describe('with loan 1 and sort=principal_amount and sortDirection=desc', function() {
      it('should return 200 and 25 loan payments as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=principal_amount&sortDirection=desc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Loan Payment 27
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment27,
          loanPaymentUuid: user1LoanPayment27Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 5
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment5,
          loanPaymentUuid: user1LoanPayment5Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 14
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment14,
          loanPaymentUuid: user1LoanPayment14Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 8
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment8,
          loanPaymentUuid: user1LoanPayment8Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 1
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment1,
          loanPaymentUuid: user1LoanPayment1Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        // Loan Payment 25
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment25,
          loanPaymentUuid: user1LoanPayment25Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[5],
        });

        // Loan Payment 16
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment16,
          loanPaymentUuid: user1LoanPayment16Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[6],
        });

        // Loan Payment 12
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment12,
          loanPaymentUuid: user1LoanPayment12Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[7],
        });

        // Loan Payment 26
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment26,
          loanPaymentUuid: user1LoanPayment26Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[8],
        });

        // Loan Payment 24
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment24,
          loanPaymentUuid: user1LoanPayment24Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[9],
        });

        // Loan Payment 13
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment13,
          loanPaymentUuid: user1LoanPayment13Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[10],
        });

        // Loan Payment 22
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment22,
          loanPaymentUuid: user1LoanPayment22Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[11],
        });

        // Loan Payment 10
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment10,
          loanPaymentUuid: user1LoanPayment10Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[12],
        });

        // Loan Payment 3
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment3,
          loanPaymentUuid: user1LoanPayment3Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[13],
        });

        // Loan Payment 9
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment9,
          loanPaymentUuid: user1LoanPayment9Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[14],
        });

        // Loan Payment 18
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment18,
          loanPaymentUuid: user1LoanPayment18Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[15],
        });

        // Loan Payment 6
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment6,
          loanPaymentUuid: user1LoanPayment6Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[16],
        });

        // Loan Payment 7
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment7,
          loanPaymentUuid: user1LoanPayment7Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[17],
        });

        // Loan Payment 21
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment21,
          loanPaymentUuid: user1LoanPayment21Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[18],
        });

        // Loan Payment 11
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment11,
          loanPaymentUuid: user1LoanPayment11Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[19],
        });

        // Loan Payment 20
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment20,
          loanPaymentUuid: user1LoanPayment20Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[20],
        });

        // Loan Payment 17
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment17,
          loanPaymentUuid: user1LoanPayment17Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[21],
        });

        // Loan Payment 15
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment15,
          loanPaymentUuid: user1LoanPayment15Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[22],
        });

        // Loan Payment 4
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment4,
          loanPaymentUuid: user1LoanPayment4Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[23],
        });

        // Loan Payment 23
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment23,
          loanPaymentUuid: user1LoanPayment23Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 loan payments as user 1 with no limit and page=2', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=principal_amount&sortDirection=desc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Loan Payment 19
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment19,
          loanPaymentUuid: user1LoanPayment19Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 2
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment2,
          loanPaymentUuid: user1LoanPayment2Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 loan payments with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=principal_amount&sortDirection=desc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Loan Payment 18
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment18,
          loanPaymentUuid: user1LoanPayment18Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 6
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment6,
          loanPaymentUuid: user1LoanPayment6Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 7
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment7,
          loanPaymentUuid: user1LoanPayment7Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 21
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment21,
          loanPaymentUuid: user1LoanPayment21Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 11
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment11,
          loanPaymentUuid: user1LoanPayment11Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });

    describe('with loan 1 and sort=interest_amount and sortDirection=asc', function() {
      it('should return 200 and 25 loan payments as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=interest_amount&sortDirection=asc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Loan Payment 5
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment5,
          loanPaymentUuid: user1LoanPayment5Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 17
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment17,
          loanPaymentUuid: user1LoanPayment17Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 4
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment4,
          loanPaymentUuid: user1LoanPayment4Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 23
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment23,
          loanPaymentUuid: user1LoanPayment23Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 18
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment18,
          loanPaymentUuid: user1LoanPayment18Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        // Loan Payment 11
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment11,
          loanPaymentUuid: user1LoanPayment11Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[5],
        });

        // Loan Payment 10
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment10,
          loanPaymentUuid: user1LoanPayment10Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[6],
        });

        // Loan Payment 27
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment27,
          loanPaymentUuid: user1LoanPayment27Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[7],
        });

        // Loan Payment 22
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment22,
          loanPaymentUuid: user1LoanPayment22Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[8],
        });

        // Loan Payment 1
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment1,
          loanPaymentUuid: user1LoanPayment1Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[9],
        });

        // Loan Payment 16
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment16,
          loanPaymentUuid: user1LoanPayment16Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[10],
        });

        // Loan Payment 13
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment13,
          loanPaymentUuid: user1LoanPayment13Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[11],
        });

        // Loan Payment 9
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment9,
          loanPaymentUuid: user1LoanPayment9Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[12],
        });

        // Loan Payment 12
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment12,
          loanPaymentUuid: user1LoanPayment12Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[13],
        });

        // Loan Payment 20
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment20,
          loanPaymentUuid: user1LoanPayment20Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[14],
        });

        // Loan Payment 26
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment26,
          loanPaymentUuid: user1LoanPayment26Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[15],
        });

        // Loan Payment 8
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment8,
          loanPaymentUuid: user1LoanPayment8Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[16],
        });

        // Loan Payment 24
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment24,
          loanPaymentUuid: user1LoanPayment24Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[17],
        });

        // Loan Payment 15
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment15,
          loanPaymentUuid: user1LoanPayment15Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[18],
        });

        // Loan Payment 14
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment14,
          loanPaymentUuid: user1LoanPayment14Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[19],
        });

        // Loan Payment 19
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment19,
          loanPaymentUuid: user1LoanPayment19Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[20],
        });

        // Loan Payment 25
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment25,
          loanPaymentUuid: user1LoanPayment25Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[21],
        });

        // Loan Payment 6
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment6,
          loanPaymentUuid: user1LoanPayment6Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[22],
        });

        // Loan Payment 2
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment2,
          loanPaymentUuid: user1LoanPayment2Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[23],
        });

        // Loan Payment 3
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment3,
          loanPaymentUuid: user1LoanPayment3Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 loan payments as user 1 with no limit and page=2', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=interest_amount&sortDirection=asc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Loan Payment 21
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment21,
          loanPaymentUuid: user1LoanPayment21Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 7
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment7,
          loanPaymentUuid: user1LoanPayment7Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 loan payments with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=interest_amount&sortDirection=asc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Loan Payment 26
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment26,
          loanPaymentUuid: user1LoanPayment26Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 8
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment8,
          loanPaymentUuid: user1LoanPayment8Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 24
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment24,
          loanPaymentUuid: user1LoanPayment24Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 15
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment15,
          loanPaymentUuid: user1LoanPayment15Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 14
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment14,
          loanPaymentUuid: user1LoanPayment14Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });

    describe('with loan 1 and sort=interest_amount and sortDirection=desc', function() {
      it('should return 200 and 25 loan payments as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=interest_amount&sortDirection=desc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Loan Payment 7
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment7,
          loanPaymentUuid: user1LoanPayment7Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 21
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment21,
          loanPaymentUuid: user1LoanPayment21Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 3
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment3,
          loanPaymentUuid: user1LoanPayment3Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 2
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment2,
          loanPaymentUuid: user1LoanPayment2Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 6
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment6,
          loanPaymentUuid: user1LoanPayment6Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        // Loan Payment 25
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment25,
          loanPaymentUuid: user1LoanPayment25Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[5],
        });

        // Loan Payment 19
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment19,
          loanPaymentUuid: user1LoanPayment19Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[6],
        });

        // Loan Payment 14
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment14,
          loanPaymentUuid: user1LoanPayment14Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[7],
        });

        // Loan Payment 15
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment15,
          loanPaymentUuid: user1LoanPayment15Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[8],
        });

        // Loan Payment 24
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment24,
          loanPaymentUuid: user1LoanPayment24Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[9],
        });

        // Loan Payment 8
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment8,
          loanPaymentUuid: user1LoanPayment8Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[10],
        });

        // Loan Payment 26
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment26,
          loanPaymentUuid: user1LoanPayment26Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[11],
        });

        // Loan Payment 20
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment20,
          loanPaymentUuid: user1LoanPayment20Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[12],
        });

        // Loan Payment 12
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment12,
          loanPaymentUuid: user1LoanPayment12Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[13],
        });

        // Loan Payment 9
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment9,
          loanPaymentUuid: user1LoanPayment9Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[14],
        });

        // Loan Payment 13
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment13,
          loanPaymentUuid: user1LoanPayment13Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[15],
        });

        // Loan Payment 16
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment16,
          loanPaymentUuid: user1LoanPayment16Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[16],
        });

        // Loan Payment 1
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment1,
          loanPaymentUuid: user1LoanPayment1Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[17],
        });

        // Loan Payment 22
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment22,
          loanPaymentUuid: user1LoanPayment22Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[18],
        });

        // Loan Payment 27
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment27,
          loanPaymentUuid: user1LoanPayment27Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[19],
        });

        // Loan Payment 10
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment10,
          loanPaymentUuid: user1LoanPayment10Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[20],
        });

        // Loan Payment 11
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment11,
          loanPaymentUuid: user1LoanPayment11Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[21],
        });

        // Loan Payment 18
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment18,
          loanPaymentUuid: user1LoanPayment18Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[22],
        });

        // Loan Payment 23
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment23,
          loanPaymentUuid: user1LoanPayment23Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[23],
        });

        // Loan Payment 4
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment4,
          loanPaymentUuid: user1LoanPayment4Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 loan payments as user 1 with no limit and page=2', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=interest_amount&sortDirection=desc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Loan Payment 17
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment17,
          loanPaymentUuid: user1LoanPayment17Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 5
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment5,
          loanPaymentUuid: user1LoanPayment5Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 loan payments with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/loan-payments?loan_id=${user1Loan1Uuid}&sort=interest_amount&sortDirection=desc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Loan Payment 13
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment13,
          loanPaymentUuid: user1LoanPayment13Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[0],
        });

        // Loan Payment 16
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment16,
          loanPaymentUuid: user1LoanPayment16Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[1],
        });

        // Loan Payment 1
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment1,
          loanPaymentUuid: user1LoanPayment1Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[2],
        });

        // Loan Payment 22
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment22,
          loanPaymentUuid: user1LoanPayment22Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[3],
        });

        // Loan Payment 27
        validateLoanPayment({
          expectedLoanPayment: sampleData.loanPayments.loanPayment27,
          loanPaymentUuid: user1LoanPayment27Uuid,
          loanUuid: user1Loan1Uuid,
          returnedLoanPayment: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const loanInclude = _.find(res.body.included, (include) => {
          return include.id === user1Loan1Uuid
            && include.type === 'loans';
        });
        assert.isOk(loanInclude);
        assert.isOk(loanInclude.attributes);
        assert.strictEqual(loanInclude.attributes.name, sampleData.loans.loan1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });
  });
});
