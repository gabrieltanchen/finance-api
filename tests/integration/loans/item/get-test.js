const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /loans/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

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
      .get(`/loans/${user1LoanUuid}`)
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
      .get(`/loans/${user1LoanUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find loan.',
      }],
    });
  });

  it('should return 404 when the loan is soft deleted', async function() {
    await models.Loan.destroy({
      where: {
        uuid: user1LoanUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/loans/${user1LoanUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find loan.',
      }],
    });
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .get(`/loans/${user1LoanUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, sampleData.loans.loan1.amount_cents);
    assert.strictEqual(res.body.data.attributes.balance, sampleData.loans.loan1.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.loans.loan1.name);
    assert.strictEqual(res.body.data.attributes['sum-interest-amount'], 0);
    assert.strictEqual(res.body.data.attributes['sum-principal-amount'], 0);
    assert.strictEqual(res.body.data.id, user1LoanUuid);
    assert.strictEqual(res.body.data.type, 'loans');
  });

  describe('when the loan has loan payment data', function() {
    beforeEach('create user 1 loan payment 1', async function() {
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
    });

    beforeEach('create user 1 loan payment 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment2.date,
        interestAmount: sampleData.loanPayments.loanPayment2.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment2.principal_amount_cents,
      });
    });

    beforeEach('create user 1 loan payment 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment3.date,
        interestAmount: sampleData.loanPayments.loanPayment3.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment3.principal_amount_cents,
      });
    });

    beforeEach('create user 1 loan payment 4', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.loanPayments.loanPayment4.date,
        interestAmount: sampleData.loanPayments.loanPayment4.interest_amount_cents,
        loanUuid: user1LoanUuid,
        principalAmount: sampleData.loanPayments.loanPayment4.principal_amount_cents,
      });
    });

    it('should return 200 with the correct sums for the loan', async function() {
      const res = await chai.request(server)
        .get(`/loans/${user1LoanUuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes.amount, sampleData.loans.loan1.amount_cents);
      assert.strictEqual(
        res.body.data.attributes.balance,
        (sampleData.loans.loan1.amount_cents
          - (
            sampleData.loanPayments.loanPayment1.principal_amount_cents
            + sampleData.loanPayments.loanPayment2.principal_amount_cents
            + sampleData.loanPayments.loanPayment3.principal_amount_cents
            + sampleData.loanPayments.loanPayment4.principal_amount_cents
          )
        ),
      );
      assert.isOk(res.body.data.attributes['created-at']);
      assert.strictEqual(res.body.data.attributes.name, sampleData.loans.loan1.name);
      assert.strictEqual(res.body.data.attributes['sum-interest-amount'], 230155);
      assert.strictEqual(res.body.data.attributes['sum-principal-amount'], 186043);
      assert.strictEqual(res.body.data.id, user1LoanUuid);
      assert.strictEqual(res.body.data.type, 'loans');
    });
  });
});
