const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /loans', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1Loan1Uuid;
  let user1Loan2Uuid;
  let user1Loan3Uuid;
  let user1Loan4Uuid;
  let user1Loan5Uuid;
  let user1Loan6Uuid;
  let user1Loan7Uuid;
  let user1Loan8Uuid;
  let user1Loan9Uuid;
  let user1Loan10Uuid;
  let user1Loan11Uuid;
  let user1Loan12Uuid;
  let user1Loan13Uuid;
  let user1Loan14Uuid;
  let user1Loan15Uuid;
  let user1Loan16Uuid;
  let user1Loan17Uuid;
  let user1Loan18Uuid;
  let user1Loan19Uuid;
  let user1Loan20Uuid;
  let user1Loan21Uuid;
  let user1Loan22Uuid;
  let user1Loan23Uuid;
  let user1Loan24Uuid;
  let user1Loan25Uuid;
  let user1Loan26Uuid;
  let user1Loan27Uuid;
  let user1Token;
  let user1Uuid;
  let user2LoanUuid;
  let user2Token;
  let user2Uuid;

  // 24 Alaina
  // 6 Antonia
  // 1 Arlene
  // 8 Bernard
  // 26 Codie
  // 17 Cory
  // 15 Deidre
  // 13 Denton
  // 10 Esme
  // 27 Floretta
  // 14 Franklyn
  // 9 Gertrude
  // 23 Jami
  // 25 Jaye
  // 2 Kacey
  // 18 Leyton
  // 7 Louisa
  // 16 Lynna
  // 5 Paula
  // 22 Ralf
  // 19 Rheanna
  // 3 Shania
  // 4 Shel
  // 12 Sheryll
  // 21 Tamara
  // 11 Tilly
  // 20 Tom

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

  before('create user 1 loan 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan3Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan3.name,
    });
  });

  before('create user 1 loan 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan4Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan4.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan4.name,
    });
  });

  before('create user 1 loan 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan5Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan5.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan5.name,
    });
  });

  before('create user 1 loan 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan6Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan6.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan6.name,
    });
  });

  before('create user 1 loan 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan7Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan7.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan7.name,
    });
  });

  before('create user 1 loan 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan8Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan8.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan8.name,
    });
  });

  before('create user 1 loan 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan9Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan9.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan9.name,
    });
  });

  before('create user 1 loan 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan10Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan10.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan10.name,
    });
  });

  before('create user 1 loan 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan11Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan11.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan11.name,
    });
  });

  before('create user 1 loan 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan12Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan12.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan12.name,
    });
  });

  before('create user 1 loan 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan13Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan13.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan13.name,
    });
  });

  before('create user 1 loan 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan14Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan14.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan14.name,
    });
  });

  before('create user 1 loan 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan15Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan15.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan15.name,
    });
  });

  before('create user 1 loan 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan16Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan16.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan16.name,
    });
  });

  before('create user 1 loan 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan17Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan17.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan17.name,
    });
  });

  before('create user 1 loan 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan18Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan18.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan18.name,
    });
  });

  before('create user 1 loan 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan19Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan19.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan19.name,
    });
  });

  before('create user 1 loan 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan20Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan20.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan20.name,
    });
  });

  before('create user 1 loan 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan21Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan21.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan21.name,
    });
  });

  before('create user 1 loan 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan22Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan22.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan22.name,
    });
  });

  before('create user 1 loan 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan23Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan23.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan23.name,
    });
  });

  before('create user 1 loan 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan24Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan24.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan24.name,
    });
  });

  before('create user 1 loan 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan25Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan25.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan25.name,
    });
  });

  before('create user 1 loan 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan26Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan26.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan26.name,
    });
  });

  before('create user 1 loan 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Loan27Uuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan27.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan27.name,
    });
    await controllers.LoanCtrl.createLoanPayment({
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.loanPayments.loanPayment1.date,
      interestAmount: sampleData.loanPayments.loanPayment1.interest_amount_cents,
      loanUuid: user1Loan27Uuid,
      principalAmount: sampleData.loans.loan27.amount_cents,
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

  before('create user 2 loan', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2LoanUuid = await controllers.LoanCtrl.createLoan({
      amount: sampleData.loans.loan28.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.loans.loan28.name,
    });
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
      .get('/loans')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 200 and 25 loans as user 1 with no limit or page specified', async function() {
    const res = await chai.request(server)
      .get('/loans')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 25);

    // Loan 24
    assert.isOk(res.body.data[0].attributes);
    assert.strictEqual(res.body.data[0].attributes.amount, sampleData.loans.loan24.amount_cents);
    assert.strictEqual(res.body.data[0].attributes.balance, sampleData.loans.loan24.amount_cents);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.loans.loan24.name);
    assert.strictEqual(res.body.data[0].id, user1Loan24Uuid);
    assert.strictEqual(res.body.data[0].type, 'loans');

    // Loan 6
    assert.isOk(res.body.data[1].attributes);
    assert.strictEqual(res.body.data[1].attributes.amount, sampleData.loans.loan6.amount_cents);
    assert.strictEqual(res.body.data[1].attributes.balance, sampleData.loans.loan6.amount_cents);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.loans.loan6.name);
    assert.strictEqual(res.body.data[1].id, user1Loan6Uuid);
    assert.strictEqual(res.body.data[1].type, 'loans');

    // Loan 1
    assert.isOk(res.body.data[2].attributes);
    assert.strictEqual(res.body.data[2].attributes.amount, sampleData.loans.loan1.amount_cents);
    assert.strictEqual(res.body.data[2].attributes.balance, sampleData.loans.loan1.amount_cents);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.loans.loan1.name);
    assert.strictEqual(res.body.data[2].id, user1Loan1Uuid);
    assert.strictEqual(res.body.data[2].type, 'loans');

    // Loan 8
    assert.isOk(res.body.data[3].attributes);
    assert.strictEqual(res.body.data[3].attributes.amount, sampleData.loans.loan8.amount_cents);
    assert.strictEqual(res.body.data[3].attributes.balance, sampleData.loans.loan8.amount_cents);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.loans.loan8.name);
    assert.strictEqual(res.body.data[3].id, user1Loan8Uuid);
    assert.strictEqual(res.body.data[3].type, 'loans');

    // Loan 26
    assert.isOk(res.body.data[4].attributes);
    assert.strictEqual(res.body.data[4].attributes.amount, sampleData.loans.loan26.amount_cents);
    assert.strictEqual(res.body.data[4].attributes.balance, sampleData.loans.loan26.amount_cents);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.loans.loan26.name);
    assert.strictEqual(res.body.data[4].id, user1Loan26Uuid);
    assert.strictEqual(res.body.data[4].type, 'loans');

    // Loan 17
    assert.isOk(res.body.data[5].attributes);
    assert.strictEqual(res.body.data[5].attributes.amount, sampleData.loans.loan17.amount_cents);
    assert.strictEqual(res.body.data[5].attributes.balance, sampleData.loans.loan17.amount_cents);
    assert.isOk(res.body.data[5].attributes['created-at']);
    assert.strictEqual(res.body.data[5].attributes.name, sampleData.loans.loan17.name);
    assert.strictEqual(res.body.data[5].id, user1Loan17Uuid);
    assert.strictEqual(res.body.data[5].type, 'loans');

    // Loan 15
    assert.isOk(res.body.data[6].attributes);
    assert.strictEqual(res.body.data[6].attributes.amount, sampleData.loans.loan15.amount_cents);
    assert.strictEqual(res.body.data[6].attributes.balance, sampleData.loans.loan15.amount_cents);
    assert.isOk(res.body.data[6].attributes['created-at']);
    assert.strictEqual(res.body.data[6].attributes.name, sampleData.loans.loan15.name);
    assert.strictEqual(res.body.data[6].id, user1Loan15Uuid);
    assert.strictEqual(res.body.data[6].type, 'loans');

    // Loan 13
    assert.isOk(res.body.data[7].attributes);
    assert.strictEqual(res.body.data[7].attributes.amount, sampleData.loans.loan13.amount_cents);
    assert.strictEqual(res.body.data[7].attributes.balance, sampleData.loans.loan13.amount_cents);
    assert.isOk(res.body.data[7].attributes['created-at']);
    assert.strictEqual(res.body.data[7].attributes.name, sampleData.loans.loan13.name);
    assert.strictEqual(res.body.data[7].id, user1Loan13Uuid);
    assert.strictEqual(res.body.data[7].type, 'loans');

    // Loan 10
    assert.isOk(res.body.data[8].attributes);
    assert.strictEqual(res.body.data[8].attributes.amount, sampleData.loans.loan10.amount_cents);
    assert.strictEqual(res.body.data[8].attributes.balance, sampleData.loans.loan10.amount_cents);
    assert.isOk(res.body.data[8].attributes['created-at']);
    assert.strictEqual(res.body.data[8].attributes.name, sampleData.loans.loan10.name);
    assert.strictEqual(res.body.data[8].id, user1Loan10Uuid);
    assert.strictEqual(res.body.data[8].type, 'loans');

    // Loan 27
    assert.isOk(res.body.data[9].attributes);
    assert.strictEqual(res.body.data[9].attributes.amount, sampleData.loans.loan27.amount_cents);
    assert.strictEqual(res.body.data[9].attributes.balance, 0);
    assert.isOk(res.body.data[9].attributes['created-at']);
    assert.strictEqual(res.body.data[9].attributes.name, sampleData.loans.loan27.name);
    assert.strictEqual(res.body.data[9].id, user1Loan27Uuid);
    assert.strictEqual(res.body.data[9].type, 'loans');

    // Loan 14
    assert.isOk(res.body.data[10].attributes);
    assert.strictEqual(res.body.data[10].attributes.amount, sampleData.loans.loan14.amount_cents);
    assert.strictEqual(res.body.data[10].attributes.balance, sampleData.loans.loan14.amount_cents);
    assert.isOk(res.body.data[10].attributes['created-at']);
    assert.strictEqual(res.body.data[10].attributes.name, sampleData.loans.loan14.name);
    assert.strictEqual(res.body.data[10].id, user1Loan14Uuid);
    assert.strictEqual(res.body.data[10].type, 'loans');

    // Loan 9
    assert.isOk(res.body.data[11].attributes);
    assert.strictEqual(res.body.data[11].attributes.amount, sampleData.loans.loan9.amount_cents);
    assert.strictEqual(res.body.data[11].attributes.balance, sampleData.loans.loan9.amount_cents);
    assert.isOk(res.body.data[11].attributes['created-at']);
    assert.strictEqual(res.body.data[11].attributes.name, sampleData.loans.loan9.name);
    assert.strictEqual(res.body.data[11].id, user1Loan9Uuid);
    assert.strictEqual(res.body.data[11].type, 'loans');

    // Loan 23
    assert.isOk(res.body.data[12].attributes);
    assert.strictEqual(res.body.data[12].attributes.amount, sampleData.loans.loan23.amount_cents);
    assert.strictEqual(res.body.data[12].attributes.balance, sampleData.loans.loan23.amount_cents);
    assert.isOk(res.body.data[12].attributes['created-at']);
    assert.strictEqual(res.body.data[12].attributes.name, sampleData.loans.loan23.name);
    assert.strictEqual(res.body.data[12].id, user1Loan23Uuid);
    assert.strictEqual(res.body.data[12].type, 'loans');

    // Loan 25
    assert.isOk(res.body.data[13].attributes);
    assert.strictEqual(res.body.data[13].attributes.amount, sampleData.loans.loan25.amount_cents);
    assert.strictEqual(res.body.data[13].attributes.balance, sampleData.loans.loan25.amount_cents);
    assert.isOk(res.body.data[13].attributes['created-at']);
    assert.strictEqual(res.body.data[13].attributes.name, sampleData.loans.loan25.name);
    assert.strictEqual(res.body.data[13].id, user1Loan25Uuid);
    assert.strictEqual(res.body.data[13].type, 'loans');

    // Loan 2
    assert.isOk(res.body.data[14].attributes);
    assert.strictEqual(res.body.data[14].attributes.amount, sampleData.loans.loan2.amount_cents);
    assert.strictEqual(res.body.data[14].attributes.balance, sampleData.loans.loan2.amount_cents);
    assert.isOk(res.body.data[14].attributes['created-at']);
    assert.strictEqual(res.body.data[14].attributes.name, sampleData.loans.loan2.name);
    assert.strictEqual(res.body.data[14].id, user1Loan2Uuid);
    assert.strictEqual(res.body.data[14].type, 'loans');

    // Loan 18
    assert.isOk(res.body.data[15].attributes);
    assert.strictEqual(res.body.data[15].attributes.amount, sampleData.loans.loan18.amount_cents);
    assert.strictEqual(res.body.data[15].attributes.balance, sampleData.loans.loan18.amount_cents);
    assert.isOk(res.body.data[15].attributes['created-at']);
    assert.strictEqual(res.body.data[15].attributes.name, sampleData.loans.loan18.name);
    assert.strictEqual(res.body.data[15].id, user1Loan18Uuid);
    assert.strictEqual(res.body.data[15].type, 'loans');

    // Loan 7
    assert.isOk(res.body.data[16].attributes);
    assert.strictEqual(res.body.data[16].attributes.amount, sampleData.loans.loan7.amount_cents);
    assert.strictEqual(res.body.data[16].attributes.balance, sampleData.loans.loan7.amount_cents);
    assert.isOk(res.body.data[16].attributes['created-at']);
    assert.strictEqual(res.body.data[16].attributes.name, sampleData.loans.loan7.name);
    assert.strictEqual(res.body.data[16].id, user1Loan7Uuid);
    assert.strictEqual(res.body.data[16].type, 'loans');

    // Loan 16
    assert.isOk(res.body.data[17].attributes);
    assert.strictEqual(res.body.data[17].attributes.amount, sampleData.loans.loan16.amount_cents);
    assert.strictEqual(res.body.data[17].attributes.balance, sampleData.loans.loan16.amount_cents);
    assert.isOk(res.body.data[17].attributes['created-at']);
    assert.strictEqual(res.body.data[17].attributes.name, sampleData.loans.loan16.name);
    assert.strictEqual(res.body.data[17].id, user1Loan16Uuid);
    assert.strictEqual(res.body.data[17].type, 'loans');

    // Loan 5
    assert.isOk(res.body.data[18].attributes);
    assert.strictEqual(res.body.data[18].attributes.amount, sampleData.loans.loan5.amount_cents);
    assert.strictEqual(res.body.data[18].attributes.balance, sampleData.loans.loan5.amount_cents);
    assert.isOk(res.body.data[18].attributes['created-at']);
    assert.strictEqual(res.body.data[18].attributes.name, sampleData.loans.loan5.name);
    assert.strictEqual(res.body.data[18].id, user1Loan5Uuid);
    assert.strictEqual(res.body.data[18].type, 'loans');

    // Loan 22
    assert.isOk(res.body.data[19].attributes);
    assert.strictEqual(res.body.data[19].attributes.amount, sampleData.loans.loan22.amount_cents);
    assert.strictEqual(res.body.data[19].attributes.balance, sampleData.loans.loan22.amount_cents);
    assert.isOk(res.body.data[19].attributes['created-at']);
    assert.strictEqual(res.body.data[19].attributes.name, sampleData.loans.loan22.name);
    assert.strictEqual(res.body.data[19].id, user1Loan22Uuid);
    assert.strictEqual(res.body.data[19].type, 'loans');

    // Loan 19
    assert.isOk(res.body.data[20].attributes);
    assert.strictEqual(res.body.data[20].attributes.amount, sampleData.loans.loan19.amount_cents);
    assert.strictEqual(res.body.data[20].attributes.balance, sampleData.loans.loan19.amount_cents);
    assert.isOk(res.body.data[20].attributes['created-at']);
    assert.strictEqual(res.body.data[20].attributes.name, sampleData.loans.loan19.name);
    assert.strictEqual(res.body.data[20].id, user1Loan19Uuid);
    assert.strictEqual(res.body.data[20].type, 'loans');

    // Loan 3
    assert.isOk(res.body.data[21].attributes);
    assert.strictEqual(res.body.data[21].attributes.amount, sampleData.loans.loan3.amount_cents);
    assert.strictEqual(res.body.data[21].attributes.balance, sampleData.loans.loan3.amount_cents);
    assert.isOk(res.body.data[21].attributes['created-at']);
    assert.strictEqual(res.body.data[21].attributes.name, sampleData.loans.loan3.name);
    assert.strictEqual(res.body.data[21].id, user1Loan3Uuid);
    assert.strictEqual(res.body.data[21].type, 'loans');

    // Loan 4
    assert.isOk(res.body.data[22].attributes);
    assert.strictEqual(res.body.data[22].attributes.amount, sampleData.loans.loan4.amount_cents);
    assert.strictEqual(res.body.data[22].attributes.balance, sampleData.loans.loan4.amount_cents);
    assert.isOk(res.body.data[22].attributes['created-at']);
    assert.strictEqual(res.body.data[22].attributes.name, sampleData.loans.loan4.name);
    assert.strictEqual(res.body.data[22].id, user1Loan4Uuid);
    assert.strictEqual(res.body.data[22].type, 'loans');

    // Loan 12
    assert.isOk(res.body.data[23].attributes);
    assert.strictEqual(res.body.data[23].attributes.amount, sampleData.loans.loan12.amount_cents);
    assert.strictEqual(res.body.data[23].attributes.balance, sampleData.loans.loan12.amount_cents);
    assert.isOk(res.body.data[23].attributes['created-at']);
    assert.strictEqual(res.body.data[23].attributes.name, sampleData.loans.loan12.name);
    assert.strictEqual(res.body.data[23].id, user1Loan12Uuid);
    assert.strictEqual(res.body.data[23].type, 'loans');

    // Loan 21
    assert.isOk(res.body.data[24].attributes);
    assert.strictEqual(res.body.data[24].attributes.amount, sampleData.loans.loan21.amount_cents);
    assert.strictEqual(res.body.data[24].attributes.balance, sampleData.loans.loan21.amount_cents);
    assert.isOk(res.body.data[24].attributes['created-at']);
    assert.strictEqual(res.body.data[24].attributes.name, sampleData.loans.loan21.name);
    assert.strictEqual(res.body.data[24].id, user1Loan21Uuid);
    assert.strictEqual(res.body.data[24].type, 'loans');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 2 loans as user 1 with no limit and page=2', async function() {
    const res = await chai.request(server)
      .get('/loans?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 2);

    // Loan 11
    assert.isOk(res.body.data[0].attributes);
    assert.strictEqual(res.body.data[0].attributes.amount, sampleData.loans.loan11.amount_cents);
    assert.strictEqual(res.body.data[0].attributes.balance, sampleData.loans.loan11.amount_cents);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.loans.loan11.name);
    assert.strictEqual(res.body.data[0].id, user1Loan11Uuid);
    assert.strictEqual(res.body.data[0].type, 'loans');

    // Loan 20
    assert.isOk(res.body.data[1].attributes);
    assert.strictEqual(res.body.data[1].attributes.amount, sampleData.loans.loan20.amount_cents);
    assert.strictEqual(res.body.data[1].attributes.balance, sampleData.loans.loan20.amount_cents);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.loans.loan20.name);
    assert.strictEqual(res.body.data[1].id, user1Loan20Uuid);
    assert.strictEqual(res.body.data[1].type, 'loans');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 5 loans as user 1 with limit=5 and page=4', async function() {
    const res = await chai.request(server)
      .get('/loans?limit=5&page=4')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 5);

    // Loan 18
    assert.isOk(res.body.data[0].attributes);
    assert.strictEqual(res.body.data[0].attributes.amount, sampleData.loans.loan18.amount_cents);
    assert.strictEqual(res.body.data[0].attributes.balance, sampleData.loans.loan18.amount_cents);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.loans.loan18.name);
    assert.strictEqual(res.body.data[0].id, user1Loan18Uuid);
    assert.strictEqual(res.body.data[0].type, 'loans');

    // Loan 7
    assert.isOk(res.body.data[1].attributes);
    assert.strictEqual(res.body.data[1].attributes.amount, sampleData.loans.loan7.amount_cents);
    assert.strictEqual(res.body.data[1].attributes.balance, sampleData.loans.loan7.amount_cents);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.loans.loan7.name);
    assert.strictEqual(res.body.data[1].id, user1Loan7Uuid);
    assert.strictEqual(res.body.data[1].type, 'loans');

    // Loan 16
    assert.isOk(res.body.data[2].attributes);
    assert.strictEqual(res.body.data[2].attributes.amount, sampleData.loans.loan16.amount_cents);
    assert.strictEqual(res.body.data[2].attributes.balance, sampleData.loans.loan16.amount_cents);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.loans.loan16.name);
    assert.strictEqual(res.body.data[2].id, user1Loan16Uuid);
    assert.strictEqual(res.body.data[2].type, 'loans');

    // Loan 5
    assert.isOk(res.body.data[3].attributes);
    assert.strictEqual(res.body.data[3].attributes.amount, sampleData.loans.loan5.amount_cents);
    assert.strictEqual(res.body.data[3].attributes.balance, sampleData.loans.loan5.amount_cents);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.loans.loan5.name);
    assert.strictEqual(res.body.data[3].id, user1Loan5Uuid);
    assert.strictEqual(res.body.data[3].type, 'loans');

    // Loan 22
    assert.isOk(res.body.data[4].attributes);
    assert.strictEqual(res.body.data[4].attributes.amount, sampleData.loans.loan22.amount_cents);
    assert.strictEqual(res.body.data[4].attributes.balance, sampleData.loans.loan22.amount_cents);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.loans.loan22.name);
    assert.strictEqual(res.body.data[4].id, user1Loan22Uuid);
    assert.strictEqual(res.body.data[4].type, 'loans');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 6);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 1 loan as user 2', async function() {
    const res = await chai.request(server)
      .get('/loans')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);

    assert.isOk(res.body.data[0].attributes);
    assert.strictEqual(res.body.data[0].attributes.amount, sampleData.loans.loan28.amount_cents);
    assert.strictEqual(res.body.data[0].attributes.balance, sampleData.loans.loan28.amount_cents);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.loans.loan28.name);
    assert.strictEqual(res.body.data[0].id, user2LoanUuid);
    assert.strictEqual(res.body.data[0].type, 'loans');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  it('should return 200 and 0 loans user 2 with page=2', async function() {
    const res = await chai.request(server)
      .get('/loans?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 0);
    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  describe('when called with the open=true query param', function() {
    it('should return 200 and 25 loans as user 1 with no limit or page specified', async function() {
      const res = await chai.request(server)
        .get('/loans?open=true')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

        // Loan 24
      assert.isOk(res.body.data[0].attributes);
      assert.strictEqual(res.body.data[0].attributes.amount, sampleData.loans.loan24.amount_cents);
      assert.strictEqual(res.body.data[0].attributes.balance, sampleData.loans.loan24.amount_cents);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(res.body.data[0].attributes.name, sampleData.loans.loan24.name);
      assert.strictEqual(res.body.data[0].id, user1Loan24Uuid);
      assert.strictEqual(res.body.data[0].type, 'loans');

      // Loan 6
      assert.isOk(res.body.data[1].attributes);
      assert.strictEqual(res.body.data[1].attributes.amount, sampleData.loans.loan6.amount_cents);
      assert.strictEqual(res.body.data[1].attributes.balance, sampleData.loans.loan6.amount_cents);
      assert.isOk(res.body.data[1].attributes['created-at']);
      assert.strictEqual(res.body.data[1].attributes.name, sampleData.loans.loan6.name);
      assert.strictEqual(res.body.data[1].id, user1Loan6Uuid);
      assert.strictEqual(res.body.data[1].type, 'loans');

      // Loan 1
      assert.isOk(res.body.data[2].attributes);
      assert.strictEqual(res.body.data[2].attributes.amount, sampleData.loans.loan1.amount_cents);
      assert.strictEqual(res.body.data[2].attributes.balance, sampleData.loans.loan1.amount_cents);
      assert.isOk(res.body.data[2].attributes['created-at']);
      assert.strictEqual(res.body.data[2].attributes.name, sampleData.loans.loan1.name);
      assert.strictEqual(res.body.data[2].id, user1Loan1Uuid);
      assert.strictEqual(res.body.data[2].type, 'loans');

      // Loan 8
      assert.isOk(res.body.data[3].attributes);
      assert.strictEqual(res.body.data[3].attributes.amount, sampleData.loans.loan8.amount_cents);
      assert.strictEqual(res.body.data[3].attributes.balance, sampleData.loans.loan8.amount_cents);
      assert.isOk(res.body.data[3].attributes['created-at']);
      assert.strictEqual(res.body.data[3].attributes.name, sampleData.loans.loan8.name);
      assert.strictEqual(res.body.data[3].id, user1Loan8Uuid);
      assert.strictEqual(res.body.data[3].type, 'loans');

      // Loan 26
      assert.isOk(res.body.data[4].attributes);
      assert.strictEqual(res.body.data[4].attributes.amount, sampleData.loans.loan26.amount_cents);
      assert.strictEqual(res.body.data[4].attributes.balance, sampleData.loans.loan26.amount_cents);
      assert.isOk(res.body.data[4].attributes['created-at']);
      assert.strictEqual(res.body.data[4].attributes.name, sampleData.loans.loan26.name);
      assert.strictEqual(res.body.data[4].id, user1Loan26Uuid);
      assert.strictEqual(res.body.data[4].type, 'loans');

      // Loan 17
      assert.isOk(res.body.data[5].attributes);
      assert.strictEqual(res.body.data[5].attributes.amount, sampleData.loans.loan17.amount_cents);
      assert.strictEqual(res.body.data[5].attributes.balance, sampleData.loans.loan17.amount_cents);
      assert.isOk(res.body.data[5].attributes['created-at']);
      assert.strictEqual(res.body.data[5].attributes.name, sampleData.loans.loan17.name);
      assert.strictEqual(res.body.data[5].id, user1Loan17Uuid);
      assert.strictEqual(res.body.data[5].type, 'loans');

      // Loan 15
      assert.isOk(res.body.data[6].attributes);
      assert.strictEqual(res.body.data[6].attributes.amount, sampleData.loans.loan15.amount_cents);
      assert.strictEqual(res.body.data[6].attributes.balance, sampleData.loans.loan15.amount_cents);
      assert.isOk(res.body.data[6].attributes['created-at']);
      assert.strictEqual(res.body.data[6].attributes.name, sampleData.loans.loan15.name);
      assert.strictEqual(res.body.data[6].id, user1Loan15Uuid);
      assert.strictEqual(res.body.data[6].type, 'loans');

      // Loan 13
      assert.isOk(res.body.data[7].attributes);
      assert.strictEqual(res.body.data[7].attributes.amount, sampleData.loans.loan13.amount_cents);
      assert.strictEqual(res.body.data[7].attributes.balance, sampleData.loans.loan13.amount_cents);
      assert.isOk(res.body.data[7].attributes['created-at']);
      assert.strictEqual(res.body.data[7].attributes.name, sampleData.loans.loan13.name);
      assert.strictEqual(res.body.data[7].id, user1Loan13Uuid);
      assert.strictEqual(res.body.data[7].type, 'loans');

      // Loan 10
      assert.isOk(res.body.data[8].attributes);
      assert.strictEqual(res.body.data[8].attributes.amount, sampleData.loans.loan10.amount_cents);
      assert.strictEqual(res.body.data[8].attributes.balance, sampleData.loans.loan10.amount_cents);
      assert.isOk(res.body.data[8].attributes['created-at']);
      assert.strictEqual(res.body.data[8].attributes.name, sampleData.loans.loan10.name);
      assert.strictEqual(res.body.data[8].id, user1Loan10Uuid);
      assert.strictEqual(res.body.data[8].type, 'loans');

      // Loan 14
      assert.isOk(res.body.data[9].attributes);
      assert.strictEqual(res.body.data[9].attributes.amount, sampleData.loans.loan14.amount_cents);
      assert.strictEqual(res.body.data[9].attributes.balance, sampleData.loans.loan14.amount_cents);
      assert.isOk(res.body.data[9].attributes['created-at']);
      assert.strictEqual(res.body.data[9].attributes.name, sampleData.loans.loan14.name);
      assert.strictEqual(res.body.data[9].id, user1Loan14Uuid);
      assert.strictEqual(res.body.data[9].type, 'loans');

      // Loan 9
      assert.isOk(res.body.data[10].attributes);
      assert.strictEqual(res.body.data[10].attributes.amount, sampleData.loans.loan9.amount_cents);
      assert.strictEqual(res.body.data[10].attributes.balance, sampleData.loans.loan9.amount_cents);
      assert.isOk(res.body.data[10].attributes['created-at']);
      assert.strictEqual(res.body.data[10].attributes.name, sampleData.loans.loan9.name);
      assert.strictEqual(res.body.data[10].id, user1Loan9Uuid);
      assert.strictEqual(res.body.data[10].type, 'loans');

      // Loan 23
      assert.isOk(res.body.data[11].attributes);
      assert.strictEqual(res.body.data[11].attributes.amount, sampleData.loans.loan23.amount_cents);
      assert.strictEqual(res.body.data[11].attributes.balance, sampleData.loans.loan23.amount_cents);
      assert.isOk(res.body.data[11].attributes['created-at']);
      assert.strictEqual(res.body.data[11].attributes.name, sampleData.loans.loan23.name);
      assert.strictEqual(res.body.data[11].id, user1Loan23Uuid);
      assert.strictEqual(res.body.data[11].type, 'loans');

      // Loan 25
      assert.isOk(res.body.data[12].attributes);
      assert.strictEqual(res.body.data[12].attributes.amount, sampleData.loans.loan25.amount_cents);
      assert.strictEqual(res.body.data[12].attributes.balance, sampleData.loans.loan25.amount_cents);
      assert.isOk(res.body.data[12].attributes['created-at']);
      assert.strictEqual(res.body.data[12].attributes.name, sampleData.loans.loan25.name);
      assert.strictEqual(res.body.data[12].id, user1Loan25Uuid);
      assert.strictEqual(res.body.data[12].type, 'loans');

      // Loan 2
      assert.isOk(res.body.data[13].attributes);
      assert.strictEqual(res.body.data[13].attributes.amount, sampleData.loans.loan2.amount_cents);
      assert.strictEqual(res.body.data[13].attributes.balance, sampleData.loans.loan2.amount_cents);
      assert.isOk(res.body.data[13].attributes['created-at']);
      assert.strictEqual(res.body.data[13].attributes.name, sampleData.loans.loan2.name);
      assert.strictEqual(res.body.data[13].id, user1Loan2Uuid);
      assert.strictEqual(res.body.data[13].type, 'loans');

      // Loan 18
      assert.isOk(res.body.data[14].attributes);
      assert.strictEqual(res.body.data[14].attributes.amount, sampleData.loans.loan18.amount_cents);
      assert.strictEqual(res.body.data[14].attributes.balance, sampleData.loans.loan18.amount_cents);
      assert.isOk(res.body.data[14].attributes['created-at']);
      assert.strictEqual(res.body.data[14].attributes.name, sampleData.loans.loan18.name);
      assert.strictEqual(res.body.data[14].id, user1Loan18Uuid);
      assert.strictEqual(res.body.data[14].type, 'loans');

      // Loan 7
      assert.isOk(res.body.data[15].attributes);
      assert.strictEqual(res.body.data[15].attributes.amount, sampleData.loans.loan7.amount_cents);
      assert.strictEqual(res.body.data[15].attributes.balance, sampleData.loans.loan7.amount_cents);
      assert.isOk(res.body.data[15].attributes['created-at']);
      assert.strictEqual(res.body.data[15].attributes.name, sampleData.loans.loan7.name);
      assert.strictEqual(res.body.data[15].id, user1Loan7Uuid);
      assert.strictEqual(res.body.data[15].type, 'loans');

      // Loan 16
      assert.isOk(res.body.data[16].attributes);
      assert.strictEqual(res.body.data[16].attributes.amount, sampleData.loans.loan16.amount_cents);
      assert.strictEqual(res.body.data[16].attributes.balance, sampleData.loans.loan16.amount_cents);
      assert.isOk(res.body.data[16].attributes['created-at']);
      assert.strictEqual(res.body.data[16].attributes.name, sampleData.loans.loan16.name);
      assert.strictEqual(res.body.data[16].id, user1Loan16Uuid);
      assert.strictEqual(res.body.data[16].type, 'loans');

      // Loan 5
      assert.isOk(res.body.data[17].attributes);
      assert.strictEqual(res.body.data[17].attributes.amount, sampleData.loans.loan5.amount_cents);
      assert.strictEqual(res.body.data[17].attributes.balance, sampleData.loans.loan5.amount_cents);
      assert.isOk(res.body.data[17].attributes['created-at']);
      assert.strictEqual(res.body.data[17].attributes.name, sampleData.loans.loan5.name);
      assert.strictEqual(res.body.data[17].id, user1Loan5Uuid);
      assert.strictEqual(res.body.data[17].type, 'loans');

      // Loan 22
      assert.isOk(res.body.data[18].attributes);
      assert.strictEqual(res.body.data[18].attributes.amount, sampleData.loans.loan22.amount_cents);
      assert.strictEqual(res.body.data[18].attributes.balance, sampleData.loans.loan22.amount_cents);
      assert.isOk(res.body.data[18].attributes['created-at']);
      assert.strictEqual(res.body.data[18].attributes.name, sampleData.loans.loan22.name);
      assert.strictEqual(res.body.data[18].id, user1Loan22Uuid);
      assert.strictEqual(res.body.data[18].type, 'loans');

      // Loan 19
      assert.isOk(res.body.data[19].attributes);
      assert.strictEqual(res.body.data[19].attributes.amount, sampleData.loans.loan19.amount_cents);
      assert.strictEqual(res.body.data[19].attributes.balance, sampleData.loans.loan19.amount_cents);
      assert.isOk(res.body.data[19].attributes['created-at']);
      assert.strictEqual(res.body.data[19].attributes.name, sampleData.loans.loan19.name);
      assert.strictEqual(res.body.data[19].id, user1Loan19Uuid);
      assert.strictEqual(res.body.data[19].type, 'loans');

      // Loan 3
      assert.isOk(res.body.data[20].attributes);
      assert.strictEqual(res.body.data[20].attributes.amount, sampleData.loans.loan3.amount_cents);
      assert.strictEqual(res.body.data[20].attributes.balance, sampleData.loans.loan3.amount_cents);
      assert.isOk(res.body.data[20].attributes['created-at']);
      assert.strictEqual(res.body.data[20].attributes.name, sampleData.loans.loan3.name);
      assert.strictEqual(res.body.data[20].id, user1Loan3Uuid);
      assert.strictEqual(res.body.data[20].type, 'loans');

      // Loan 4
      assert.isOk(res.body.data[21].attributes);
      assert.strictEqual(res.body.data[21].attributes.amount, sampleData.loans.loan4.amount_cents);
      assert.strictEqual(res.body.data[21].attributes.balance, sampleData.loans.loan4.amount_cents);
      assert.isOk(res.body.data[21].attributes['created-at']);
      assert.strictEqual(res.body.data[21].attributes.name, sampleData.loans.loan4.name);
      assert.strictEqual(res.body.data[21].id, user1Loan4Uuid);
      assert.strictEqual(res.body.data[21].type, 'loans');

      // Loan 12
      assert.isOk(res.body.data[22].attributes);
      assert.strictEqual(res.body.data[22].attributes.amount, sampleData.loans.loan12.amount_cents);
      assert.strictEqual(res.body.data[22].attributes.balance, sampleData.loans.loan12.amount_cents);
      assert.isOk(res.body.data[22].attributes['created-at']);
      assert.strictEqual(res.body.data[22].attributes.name, sampleData.loans.loan12.name);
      assert.strictEqual(res.body.data[22].id, user1Loan12Uuid);
      assert.strictEqual(res.body.data[22].type, 'loans');

      // Loan 21
      assert.isOk(res.body.data[23].attributes);
      assert.strictEqual(res.body.data[23].attributes.amount, sampleData.loans.loan21.amount_cents);
      assert.strictEqual(res.body.data[23].attributes.balance, sampleData.loans.loan21.amount_cents);
      assert.isOk(res.body.data[23].attributes['created-at']);
      assert.strictEqual(res.body.data[23].attributes.name, sampleData.loans.loan21.name);
      assert.strictEqual(res.body.data[23].id, user1Loan21Uuid);
      assert.strictEqual(res.body.data[23].type, 'loans');

      // Loan 11
      assert.isOk(res.body.data[24].attributes);
      assert.strictEqual(res.body.data[24].attributes.amount, sampleData.loans.loan11.amount_cents);
      assert.strictEqual(res.body.data[24].attributes.balance, sampleData.loans.loan11.amount_cents);
      assert.isOk(res.body.data[24].attributes['created-at']);
      assert.strictEqual(res.body.data[24].attributes.name, sampleData.loans.loan11.name);
      assert.strictEqual(res.body.data[24].id, user1Loan11Uuid);
      assert.strictEqual(res.body.data[24].type, 'loans');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 26);
    });

    it('should return 200 and 1 loan as user 1 with no limit and page=2', async function() {
      const res = await chai.request(server)
        .get('/loans?open=true&page=2')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Loan 20
      assert.isOk(res.body.data[0].attributes);
      assert.strictEqual(res.body.data[0].attributes.amount, sampleData.loans.loan20.amount_cents);
      assert.strictEqual(res.body.data[0].attributes.balance, sampleData.loans.loan20.amount_cents);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(res.body.data[0].attributes.name, sampleData.loans.loan20.name);
      assert.strictEqual(res.body.data[0].id, user1Loan20Uuid);
      assert.strictEqual(res.body.data[0].type, 'loans');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 26);
    });
  });
});
