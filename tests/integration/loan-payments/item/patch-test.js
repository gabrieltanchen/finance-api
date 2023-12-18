const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /loan-payments/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateLoanPaymentSpy;

  let user1LoanPaymentUuid;
  let user1Loan1Uuid;
  let user1Loan2Uuid;
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
    updateLoanPaymentSpy = sinon.spy(controllers.LoanCtrl, 'updateLoanPayment');
  });

  after('restore sinon spies', function() {
    updateLoanPaymentSpy.restore();
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

  beforeEach('create user 1 loan 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan1Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan1.name,
    });
  });

  beforeEach('create user 1 loan 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan2Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan2.name,
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
      loanUuid: user1Loan1Uuid,
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

  afterEach('reset history for sinon spies', async function() {
    updateLoanPaymentSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment2.date,
            'interest-amount': sampleData.loanPayments.loanPayment2.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment2.principal_amount_cents,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(updateLoanPaymentSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment2.date,
            'interest-amount': sampleData.loanPayments.loanPayment2.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment2.principal_amount_cents,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find loan payment.',
      }],
    });

    assert.strictEqual(updateLoanPaymentSpy.callCount, 1);
    const updateLoanPaymentParams = updateLoanPaymentSpy.getCall(0).args[0];
    assert.isOk(updateLoanPaymentParams.auditApiCallUuid);
    assert.strictEqual(updateLoanPaymentParams.date, sampleData.loanPayments.loanPayment2.date);
    assert.strictEqual(
      updateLoanPaymentParams.interestAmount,
      sampleData.loanPayments.loanPayment2.interest_amount_cents,
    );
    assert.strictEqual(updateLoanPaymentParams.loanUuid, user1Loan2Uuid);
    assert.strictEqual(
      updateLoanPaymentParams.principalAmount,
      sampleData.loanPayments.loanPayment2.principal_amount_cents,
    );
  });

  it('should return 422 with no date', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'date': null,
            'interest-amount': sampleData.loanPayments.loanPayment2.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment2.principal_amount_cents,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Date is required.',
        source: {
          pointer: '/data/attributes/date',
        },
      }, {
        detail: 'Date must be valid.',
        source: {
          pointer: '/data/attributes/date',
        },
      }],
    });
  });

  it('should return 422 with an invalid date', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'date': 'invalid date',
            'interest-amount': sampleData.loanPayments.loanPayment2.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment2.principal_amount_cents,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Date must be valid.',
        source: {
          pointer: '/data/attributes/date',
        },
      }],
    });
  });

  it('should return 422 with no interest amount', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment2.date,
            'interest-amount': null,
            'principal-amount': sampleData.loanPayments.loanPayment2.principal_amount_cents,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Interest amount is required.',
        source: {
          pointer: '/data/attributes/interest-amount',
        },
      }],
    });
  });

  it('should return 422 with an invalid interest amount', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment2.date,
            'interest-amount': '12.34',
            'principal-amount': sampleData.loanPayments.loanPayment2.principal_amount_cents,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Interest amount must be an integer.',
        source: {
          pointer: '/data/attributes/interest-amount',
        },
      }],
    });
  });

  it('should return 422 with no principal amount', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment2.date,
            'interest-amount': sampleData.loanPayments.loanPayment2.interest_amount_cents,
            'principal-amount': null,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Principal amount is required.',
        source: {
          pointer: '/data/attributes/principal-amount',
        },
      }],
    });
  });

  it('should return 422 with an invalid principal amount', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment2.date,
            'interest-amount': sampleData.loanPayments.loanPayment2.interest_amount_cents,
            'principal-amount': '12.34',
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Principal amount must be an integer.',
        source: {
          pointer: '/data/attributes/principal-amount',
        },
      }],
    });
  });

  it('should return 422 with no loan uuid', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment2.date,
            'interest-amount': sampleData.loanPayments.loanPayment2.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment2.principal_amount_cents,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': null,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Loan is required.',
        source: {
          pointer: '/data/relationships/loan/data/id',
        },
      }],
    });
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/loan-payments/${user1LoanPaymentUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment2.date,
            'interest-amount': sampleData.loanPayments.loanPayment2.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment2.principal_amount_cents,
          },
          'id': user1LoanPaymentUuid,
          'relationships': {
            'loan': {
              'data': {
                'id': user1Loan2Uuid,
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.loanPayments.loanPayment2.date);
    assert.strictEqual(
      res.body.data.attributes['interest-amount'],
      sampleData.loanPayments.loanPayment2.interest_amount_cents,
    );
    assert.strictEqual(
      res.body.data.attributes['principal-amount'],
      sampleData.loanPayments.loanPayment2.principal_amount_cents,
    );
    assert.strictEqual(res.body.data.id, user1LoanPaymentUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.loan);
    assert.isOk(res.body.data.relationships.loan.data);
    assert.strictEqual(res.body.data.relationships.loan.data.id, user1Loan2Uuid);
    assert.strictEqual(res.body.data.relationships.loan.data.type, 'loans');
    assert.strictEqual(res.body.data.type, 'loan-payments');

    // Validate LoanCtrl.updateLoanPayment call.
    assert.strictEqual(updateLoanPaymentSpy.callCount, 1);
    const updateLoanPaymentParams = updateLoanPaymentSpy.getCall(0).args[0];
    assert.isOk(updateLoanPaymentParams.auditApiCallUuid);
    assert.strictEqual(updateLoanPaymentParams.date, sampleData.loanPayments.loanPayment2.date);
    assert.strictEqual(
      updateLoanPaymentParams.interestAmount,
      sampleData.loanPayments.loanPayment2.interest_amount_cents,
    );
    assert.strictEqual(updateLoanPaymentParams.loanUuid, user1Loan2Uuid);
    assert.strictEqual(
      updateLoanPaymentParams.principalAmount,
      sampleData.loanPayments.loanPayment2.principal_amount_cents,
    );

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
        uuid: updateLoanPaymentParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/loan-payments/${user1LoanPaymentUuid}`);
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
