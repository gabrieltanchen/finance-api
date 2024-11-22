import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import sampleData from '../../sample-data/index.js';
import TestHelper from '../../test-helper/index.js';

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /loans', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createLoanSpy;

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
    createLoanSpy = sinon.spy(controllers.LoanCtrl, 'createLoan');
  });

  after('restore sinon spies', function() {
    createLoanSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user 1', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    userUuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  beforeEach('create user 1 token', async function() {
    userToken = await controllers.UserCtrl.getToken(userUuid);
  });

  afterEach('reset history for sinon spies', function() {
    createLoanSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/loans')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.loans.loan1.amount_cents,
            'name': sampleData.loans.loan1.name,
          },
          'type': 'loans',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(createLoanSpy.callCount, 0);
  });

  it('should return 422 with no amount', async function() {
    const res = await chai.request(server)
      .post('/loans')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': null,
            'name': sampleData.loans.loan1.name,
          },
          'type': 'loans',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Amount is required.',
        source: {
          pointer: '/data/attributes/amount',
        },
      }],
    });
    assert.strictEqual(createLoanSpy.callCount, 0);
  });

  it('should return 422 with an invalid amount', async function() {
    const res = await chai.request(server)
      .post('/loans')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': '12.34',
            'name': sampleData.loans.loan1.name,
          },
          'type': 'loans',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Amount must be an integer.',
        source: {
          pointer: '/data/attributes/amount',
        },
      }],
    });
    assert.strictEqual(createLoanSpy.callCount, 0);
  });

  it('should return 422 with no name', async function() {
    const res = await chai.request(server)
      .post('/loans')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.loans.loan1.amount_cents,
            'name': '',
          },
          'type': 'loans',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Loan name is required.',
        source: {
          pointer: '/data/attributes/name',
        },
      }],
    });
    assert.strictEqual(createLoanSpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/loans')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.loans.loan1.amount_cents,
            'name': sampleData.loans.loan1.name,
          },
          'type': 'loans',
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, sampleData.loans.loan1.amount_cents);
    assert.strictEqual(res.body.data.attributes.balance, sampleData.loans.loan1.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.loans.loan1.name);
    assert.isOk(res.body.data.id);
    assert.strictEqual(res.body.data.type, 'loans');

    // Validate LoanCtrl.createLoan call.
    assert.strictEqual(createLoanSpy.callCount, 1);
    const createLoanParams = createLoanSpy.getCall(0).args[0];
    assert.strictEqual(createLoanParams.amount, sampleData.loans.loan1.amount_cents);
    assert.isOk(createLoanParams.auditApiCallUuid);
    assert.strictEqual(createLoanParams.name, sampleData.loans.loan1.name);

    // Validate API call.
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
        uuid: createLoanParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/loans');
    assert.strictEqual(apiCall.get('user_uuid'), userUuid);
  });
});
