import chai from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';
import { LoanError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Controllers - LoanCtrl.deleteLoan', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdUuid;
  let user1LoanUuid;
  let user1Uuid;
  let user2Uuid;

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
    const user = await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
    user2Uuid = user.get('uuid');
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
      await controllers.LoanCtrl.deleteLoan({
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: null,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Loan is required');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.LoanCtrl.deleteLoan({
        auditApiCallUuid: null,
        loanUuid: user1LoanUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.LoanCtrl.deleteLoan({
        auditApiCallUuid: uuidv4(),
        loanUuid: user1LoanUuid,
      });
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
      await controllers.LoanCtrl.deleteLoan({
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: user1LoanUuid,
      });
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
      await controllers.LoanCtrl.deleteLoan({
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: uuidv4(),
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the loan belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.LoanCtrl.deleteLoan({
        auditApiCallUuid: apiCall.get('uuid'),
        loanUuid: user1LoanUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof LoanError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve when the loan belongs to the user\'s household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.LoanCtrl.deleteLoan({
      auditApiCallUuid: apiCall.get('uuid'),
      loanUuid: user1LoanUuid,
    });

    // Verify that the Loan instance is deleted.
    const loan = await models.Loan.findOne({
      attributes: ['uuid'],
      where: {
        uuid: user1LoanUuid,
      },
    });
    assert.isNull(loan);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isOk(trackChangesParams.deleteList);
    const deleteLoan = _.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.Loan
        && deleteInstance.get('uuid') === user1LoanUuid;
    });
    assert.isOk(deleteLoan);
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
