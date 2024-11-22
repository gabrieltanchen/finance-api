import chai from 'chai';
import chaiHttp from 'chai-http';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /loan-payments/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1LoanPaymentUuid;
  let user1LoanUuid;
  let user1Token;
  let user1Uuid;
  let user2LoanUuid;
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

  beforeEach('create user 2 loan', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2LoanUuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan2.name,
    });
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 404 when the loan payment is soft deleted', async function() {
    await models.LoanPayment.destroy({
      where: {
        uuid: user1LoanPaymentUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find loan payment.',
      }],
    });
  });

  it('should return 404 when the loan payment belongs to a different household', async function() {
    const res = await chai.request(server)
      .get(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find loan payment.',
      }],
    });
  });

  // This should not happen.
  it('should return 404 when the loan belongs to a different household', async function() {
    await models.LoanPayment.update({
      loan_uuid: user2LoanUuid,
    }, {
      where: {
        uuid: user1LoanPaymentUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find loan payment.',
      }],
    });
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .get(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.loanPayments.loanPayment1.date);
    assert.strictEqual(res.body.data.attributes['interest-amount'], sampleData.loanPayments.loanPayment1.interest_amount_cents);
    assert.strictEqual(res.body.data.attributes['principal-amount'], sampleData.loanPayments.loanPayment1.principal_amount_cents);
    assert.strictEqual(res.body.data.id, user1LoanPaymentUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.loan);
    assert.isOk(res.body.data.relationships.loan.data);
    assert.strictEqual(res.body.data.relationships.loan.data.id, user1LoanUuid);
    assert.strictEqual(res.body.data.relationships.loan.data.type, 'loans');
    assert.strictEqual(res.body.data.type, 'loan-payments');
  });
});
