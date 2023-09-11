const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /loan-payments', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createLoanPaymentSpy;

  let loanUuid;
  let userToken;
  let userUuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    createLoanPaymentSpy = sinon.spy(controllers.LoanCtrl, 'createLoanPayment');
  });

  after('restore sinon spies', function() {
    createLoanPaymentSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    userUuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  beforeEach('create user token', async function() {
    userToken = await controllers.UserCtrl.getToken(userUuid);
  });

  beforeEach('create loan', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    loanUuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan1.name,
    });
  });

  afterEach('reset history for sinon spies', function() {
    createLoanPaymentSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment1.date,
            'interest-amount': sampleData.loanPayments.loanPayment1.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment1.principal_amount_cents,
          },
          'relationships': {
            'loan': {
              'data': {
                'id': loanUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 422 with no date', async function() {
    const res = await chai.request(server)
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'date': null,
            'interest-amount': sampleData.loanPayments.loanPayment1.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment1.principal_amount_cents,
          },
          'relationships': {
            'loan': {
              'data': {
                'id': loanUuid,
              },
            },
          },
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
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'date': 'invalid date',
            'interest-amount': sampleData.loanPayments.loanPayment1.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment1.principal_amount_cents,
          },
          'relationships': {
            'loan': {
              'data': {
                'id': loanUuid,
              },
            },
          },
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
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment1.date,
            'interest-amount': null,
            'principal-amount': sampleData.loanPayments.loanPayment1.principal_amount_cents,
          },
          'relationships': {
            'loan': {
              'data': {
                'id': loanUuid,
              },
            },
          },
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
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment1.date,
            'interest-amount': '12.34',
            'principal-amount': sampleData.loanPayments.loanPayment1.principal_amount_cents,
          },
          'relationships': {
            'loan': {
              'data': {
                'id': loanUuid,
              },
            },
          },
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
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment1.date,
            'interest-amount': sampleData.loanPayments.loanPayment1.interest_amount_cents,
            'principal-amount': null,
          },
          'relationships': {
            'loan': {
              'data': {
                'id': loanUuid,
              },
            },
          },
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
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment1.date,
            'interest-amount': sampleData.loanPayments.loanPayment1.interest_amount_cents,
            'principal-amount': '12.34',
          },
          'relationships': {
            'loan': {
              'data': {
                'id': loanUuid,
              },
            },
          },
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
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment1.date,
            'interest-amount': sampleData.loanPayments.loanPayment1.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment1.principal_amount_cents,
          },
          'relationships': {
            'loan': {
              'data': {
                'id': null,
              },
            },
          },
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

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/loan-payments')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'date': sampleData.loanPayments.loanPayment1.date,
            'interest-amount': sampleData.loanPayments.loanPayment1.interest_amount_cents,
            'principal-amount': sampleData.loanPayments.loanPayment1.principal_amount_cents,
          },
          'relationships': {
            'loan': {
              'data': {
                'id': loanUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.loanPayments.loanPayment1.date);
    assert.strictEqual(res.body.data.attributes['interest-amount'], sampleData.loanPayments.loanPayment1.interest_amount_cents);
    assert.strictEqual(res.body.data.attributes['principal-amount'], sampleData.loanPayments.loanPayment1.principal_amount_cents);
    assert.isOk(res.body.data.id);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.loan);
    assert.isOk(res.body.data.relationships.loan.data);
    assert.strictEqual(res.body.data.relationships.loan.data.id, loanUuid);
    assert.strictEqual(res.body.data.relationships.loan.data.type, 'loans');
    assert.strictEqual(res.body.data.type, 'loan-payments');

    // Validate LoanCtrl.createLoanPayment call.
    assert.strictEqual(createLoanPaymentSpy.callCount, 1);
    const createLoanPaymentParams = createLoanPaymentSpy.getCall(0).args[0];
    assert.isOk(createLoanPaymentParams.auditApiCallUuid);
    assert.strictEqual(createLoanPaymentParams.date, sampleData.loanPayments.loanPayment1.date);
    assert.strictEqual(
      createLoanPaymentParams.interestAmount,
      sampleData.loanPayments.loanPayment1.interest_amount_cents,
    );
    assert.strictEqual(createLoanPaymentParams.loanUuid, loanUuid);
    assert.strictEqual(
      createLoanPaymentParams.principalAmount,
      sampleData.loanPayments.loanPayment1.principal_amount_cents,
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
        uuid: createLoanPaymentParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/loan-payments');
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), userUuid);
  });
});
