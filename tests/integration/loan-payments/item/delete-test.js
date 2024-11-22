import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - DELETE /loan-payments/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let deleteLoanPaymentSpy;

  let user1LoanPaymentUuid;
  let user1LoanUuid;
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

  before('create sinon spies', function() {
    deleteLoanPaymentSpy = sinon.spy(controllers.LoanCtrl, 'deleteLoanPayment');
  });

  after('restore sinon spies', function() {
    deleteLoanPaymentSpy.restore();
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

  beforeEach('create user 1 loan', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanUuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan1.name,
    });
  });

  beforeEach('create user 1 loan payment', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1LoanPaymentUuid = await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment1.date,
      interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loanUuid: user1LoanUuid,
      principalAmount: sampleData.loanPayments.loanPayment1.principal_amount_cents,
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

  afterEach('reset history for sinon spies', function() {
    deleteLoanPaymentSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .delete(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(deleteLoanPaymentSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .delete(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find loan payment.',
      }],
    });

    assert.strictEqual(deleteLoanPaymentSpy.callCount, 1);
    const deleteLoanPaymentParams = deleteLoanPaymentSpy.getCall(0).args[0];
    assert.isOk(deleteLoanPaymentParams.auditApiCallUuid);
    assert.strictEqual(deleteLoanPaymentParams.loanPaymentUuid, user1LoanPaymentUuid);
  });

  it('should return 204 with the correct auth token', async function() {
    const res = await chai.request(server)
      .delete(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(204);
    assert.deepEqual(res.body, {});

    // Validate LoanCtrl.deleteLoanPayment call.
    assert.strictEqual(deleteLoanPaymentSpy.callCount, 1);
    const deleteLoanPaymentParams = deleteLoanPaymentSpy.getCall(0).args[0];
    assert.isOk(deleteLoanPaymentParams.auditApiCallUuid);
    assert.strictEqual(deleteLoanPaymentParams.loanPaymentUuid, user1LoanPaymentUuid);

    // Validate Audit API call.
    const apiCall = await models.Audit.ApiCall.findOne({
      attributes: [
        'http_method',
        'ip_address',
        'route',
        'user_agent',
        'user_uuid',
        'uuid',
      ],
      where: {
        uuid: deleteLoanPaymentParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'DELETE');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/loan-payments/${user1LoanPaymentUuid}`);
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
