import chai from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';
import { IncomeError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Controllers - IncomeCtrl.updateIncome', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdMember1Uuid;
  let user1HouseholdMember2Uuid;
  let user1HouseholdUuid;
  let user1IncomeUuid;
  let user1Uuid;
  let user2HouseholdMemberUuid;
  let user2HouseholdUuid;
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

  beforeEach('create user 1 household member 1', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user1.firstName,
    });
    user1HouseholdMember1Uuid = householdMember.get('uuid');
  });

  beforeEach('create user 1 household member 2', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user2.firstName,
    });
    user1HouseholdMember2Uuid = householdMember.get('uuid');
  });

  beforeEach('create user 1 income', async function() {
    const income = await models.Income.create({
      amount_cents: sampleData.incomes.income1.amount_cents,
      date: sampleData.incomes.income1.date,
      description: sampleData.incomes.income1.description,
      household_member_uuid: user1HouseholdMember1Uuid,
    });
    user1IncomeUuid = income.get('uuid');
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

  beforeEach('create user 2 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.users.user3.firstName,
    });
    user2HouseholdMemberUuid = householdMember.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no income UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Income is required');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no household member UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: null,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member is required');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: null,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: 'invalid date',
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: null,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: null,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: 1234,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: null,
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: uuidv4(),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof IncomeError);
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
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the income does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the income belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the income household member belongs to a different household', async function() {
    try {
      await models.Income.update({
        household_member_uuid: user2HouseholdMemberUuid,
      }, {
        where: {
          uuid: user1IncomeUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.IncomeCtrl.updateIncome({
      amount: sampleData.incomes.income1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income1.date,
      description: sampleData.incomes.income1.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1IncomeUuid,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.IncomeCtrl.updateIncome({
      amount: sampleData.incomes.income2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income1.date,
      description: sampleData.incomes.income1.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1IncomeUuid,
    });

    // Verify the Income instance.
    const income = await models.Income.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'employer_uuid',
        'household_member_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }],
      where: {
        uuid: user1IncomeUuid,
      },
    });
    assert.isOk(income);
    assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income2.amount_cents);
    assert.strictEqual(income.get('date'), sampleData.incomes.income1.date);
    assert.strictEqual(income.get('description'), sampleData.incomes.income1.description);
    assert.isNull(income.get('employer_uuid'));
    assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Income
        && updateInstance.get('uuid') === user1IncomeUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the date', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.IncomeCtrl.updateIncome({
      amount: sampleData.incomes.income1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income2.date,
      description: sampleData.incomes.income1.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1IncomeUuid,
    });

    // Verify the Income instance.
    const income = await models.Income.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'employer_uuid',
        'household_member_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }],
      where: {
        uuid: user1IncomeUuid,
      },
    });
    assert.isOk(income);
    assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income1.amount_cents);
    assert.strictEqual(income.get('date'), sampleData.incomes.income2.date);
    assert.strictEqual(income.get('description'), sampleData.incomes.income1.description);
    assert.isNull(income.get('employer_uuid'));
    assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Income
        && updateInstance.get('uuid') === user1IncomeUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the description', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.IncomeCtrl.updateIncome({
      amount: sampleData.incomes.income1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income1.date,
      description: sampleData.incomes.income2.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1IncomeUuid,
    });

    // Verify the Income instance.
    const income = await models.Income.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'employer_uuid',
        'household_member_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }],
      where: {
        uuid: user1IncomeUuid,
      },
    });
    assert.isOk(income);
    assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income1.amount_cents);
    assert.strictEqual(income.get('date'), sampleData.incomes.income1.date);
    assert.strictEqual(income.get('description'), sampleData.incomes.income2.description);
    assert.isNull(income.get('employer_uuid'));
    assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember1Uuid);
    assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Income
        && updateInstance.get('uuid') === user1IncomeUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the household member when it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: uuidv4(),
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member not found');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject updating the household member when it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user2HouseholdMemberUuid,
        incomeUuid: user1IncomeUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member not found');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.IncomeCtrl.updateIncome({
      amount: sampleData.incomes.income1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income1.date,
      description: sampleData.incomes.income1.description,
      householdMemberUuid: user1HouseholdMember2Uuid,
      incomeUuid: user1IncomeUuid,
    });

    // Verify the Income instance.
    const income = await models.Income.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'employer_uuid',
        'household_member_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }],
      where: {
        uuid: user1IncomeUuid,
      },
    });
    assert.isOk(income);
    assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income1.amount_cents);
    assert.strictEqual(income.get('date'), sampleData.incomes.income1.date);
    assert.strictEqual(income.get('description'), sampleData.incomes.income1.description);
    assert.isNull(income.get('employer_uuid'));
    assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember2Uuid);
    assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Income
        && updateInstance.get('uuid') === user1IncomeUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating all attributes', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.IncomeCtrl.updateIncome({
      amount: sampleData.incomes.income2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income2.date,
      description: sampleData.incomes.income2.description,
      householdMemberUuid: user1HouseholdMember2Uuid,
      incomeUuid: user1IncomeUuid,
    });

    // Verify the Income instance.
    const income = await models.Income.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'employer_uuid',
        'household_member_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.HouseholdMember,
        required: true,
      }],
      where: {
        uuid: user1IncomeUuid,
      },
    });
    assert.isOk(income);
    assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income2.amount_cents);
    assert.strictEqual(income.get('date'), sampleData.incomes.income2.date);
    assert.strictEqual(income.get('description'), sampleData.incomes.income2.description);
    assert.isNull(income.get('employer_uuid'));
    assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember2Uuid);
    assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Income
        && updateInstance.get('uuid') === user1IncomeUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when adding an employer to an income', function() {
    let user1EmployerUuid;
    let user2EmployerUuid;

    beforeEach('create user 1 employer', async function() {
      const employer = await models.Employer.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.employers.employer1.name,
      });
      user1EmployerUuid = employer.get('uuid');
    });

    beforeEach('create user 2 employer', async function() {
      const employer = await models.Employer.create({
        household_uuid: user2HouseholdUuid,
        name: sampleData.employers.employer2.name,
      });
      user2EmployerUuid = employer.get('uuid');
    });

    it('should reject when the employer does not exist', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.IncomeCtrl.updateIncome({
          amount: sampleData.incomes.income1.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.incomes.income1.date,
          description: sampleData.incomes.income1.description,
          employerUuid: uuidv4(),
          householdMemberUuid: user1HouseholdMember1Uuid,
          incomeUuid: user1IncomeUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Employer not found');
        assert.isTrue(err instanceof IncomeError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should reject when the employer belongs to a different household', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.IncomeCtrl.updateIncome({
          amount: sampleData.incomes.income1.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.incomes.income1.date,
          description: sampleData.incomes.income1.description,
          employerUuid: user2EmployerUuid,
          householdMemberUuid: user1HouseholdMember1Uuid,
          incomeUuid: user1IncomeUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Employer not found');
        assert.isTrue(err instanceof IncomeError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve adding the employer', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        employerUuid: user1EmployerUuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1IncomeUuid,
      });

      // Verify the Income instance.
      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'employer_uuid',
          'household_member_uuid',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }],
        where: {
          uuid: user1IncomeUuid,
        },
      });

      assert.isOk(income);
      assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income1.amount_cents);
      assert.strictEqual(income.get('date'), sampleData.incomes.income1.date);
      assert.strictEqual(income.get('description'), sampleData.incomes.income1.description);
      assert.strictEqual(income.get('employer_uuid'), user1EmployerUuid);
      assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Income
          && updateInstance.get('uuid') === user1IncomeUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve when updating all other attributes', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        employerUuid: user1EmployerUuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });

      // Verify the Income instance.
      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'employer_uuid',
          'household_member_uuid',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }],
        where: {
          uuid: user1IncomeUuid,
        },
      });

      assert.isOk(income);
      assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income2.amount_cents);
      assert.strictEqual(income.get('date'), sampleData.incomes.income2.date);
      assert.strictEqual(income.get('description'), sampleData.incomes.income2.description);
      assert.strictEqual(income.get('employer_uuid'), user1EmployerUuid);
      assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember2Uuid);
      assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Income
          && updateInstance.get('uuid') === user1IncomeUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });

  describe('when removing an employer from an income', function() {
    let user1EmployerUuid;

    beforeEach('create user 1 employer', async function() {
      const employer = await models.Employer.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.employers.employer1.name,
      });
      user1EmployerUuid = employer.get('uuid');
    });

    beforeEach('add employer to income', async function() {
      await models.Income.update({
        employer_uuid: user1EmployerUuid,
      }, {
        where: {
          uuid: user1IncomeUuid,
        },
      });
    });

    it('should resolve removing the fund', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        employerUuid: null,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1IncomeUuid,
      });

      // Verify the Income instance.
      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'employer_uuid',
          'household_member_uuid',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }],
        where: {
          uuid: user1IncomeUuid,
        },
      });

      assert.isOk(income);
      assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income1.amount_cents);
      assert.strictEqual(income.get('date'), sampleData.incomes.income1.date);
      assert.strictEqual(income.get('description'), sampleData.incomes.income1.description);
      assert.isNull(income.get('employer_uuid'));
      assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Income
          && updateInstance.get('uuid') === user1IncomeUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve when updating all other attributes', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        employerUuid: null,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });

      // Verify the Income instance.
      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'employer_uuid',
          'household_member_uuid',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }],
        where: {
          uuid: user1IncomeUuid,
        },
      });

      assert.isOk(income);
      assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income2.amount_cents);
      assert.strictEqual(income.get('date'), sampleData.incomes.income2.date);
      assert.strictEqual(income.get('description'), sampleData.incomes.income2.description);
      assert.isNull(income.get('employer_uuid'));
      assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember2Uuid);
      assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Income
          && updateInstance.get('uuid') === user1IncomeUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });

  describe('when updating to a different employer', function() {
    let user1Employer1Uuid;
    let user1Employer2Uuid;
    let user2EmployerUuid;

    beforeEach('create user 1 employer 1', async function() {
      const employer = await models.Employer.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.employers.employer1.name,
      });
      user1Employer1Uuid = employer.get('uuid');
    });

    beforeEach('create user 1 employer 2', async function() {
      const employer = await models.Employer.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.employers.employer2.name,
      });
      user1Employer2Uuid = employer.get('uuid');
    });

    beforeEach('create user 2 employer', async function() {
      const employer = await models.Employer.create({
        household_uuid: user2HouseholdUuid,
        name: sampleData.employers.employer3.name,
      });
      user2EmployerUuid = employer.get('uuid');
    });

    beforeEach('add employer to income', async function() {
      await models.Income.update({
        employer_uuid: user1Employer1Uuid,
      }, {
        where: {
          uuid: user1IncomeUuid,
        },
      });
    });

    it('should reject when the new employer does not exist', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.IncomeCtrl.updateIncome({
          amount: sampleData.incomes.income1.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.incomes.income1.date,
          description: sampleData.incomes.income1.description,
          employerUuid: uuidv4(),
          householdMemberUuid: user1HouseholdMember1Uuid,
          incomeUuid: user1IncomeUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Employer not found');
        assert.isTrue(err instanceof IncomeError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should reject when the new employer belongs to a different household', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.IncomeCtrl.updateIncome({
          amount: sampleData.incomes.income1.amount_cents,
          auditApiCallUuid: apiCall.get('uuid'),
          date: sampleData.incomes.income1.date,
          description: sampleData.incomes.income1.description,
          employerUuid: user2EmployerUuid,
          householdMemberUuid: user1HouseholdMember1Uuid,
          incomeUuid: user1IncomeUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Employer not found');
        assert.isTrue(err instanceof IncomeError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve updating to the new employer', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        employerUuid: user1Employer2Uuid,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1IncomeUuid,
      });

      // Verify the Income instance.
      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'employer_uuid',
          'household_member_uuid',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }],
        where: {
          uuid: user1IncomeUuid,
        },
      });

      assert.isOk(income);
      assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income1.amount_cents);
      assert.strictEqual(income.get('date'), sampleData.incomes.income1.date);
      assert.strictEqual(income.get('description'), sampleData.incomes.income1.description);
      assert.strictEqual(income.get('employer_uuid'), user1Employer2Uuid);
      assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember1Uuid);
      assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember1Uuid);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Income
          && updateInstance.get('uuid') === user1IncomeUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });

    it('should resolve when updating all other attributes', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.updateIncome({
        amount: sampleData.incomes.income2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income2.date,
        description: sampleData.incomes.income2.description,
        employerUuid: user1Employer2Uuid,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1IncomeUuid,
      });

      // Verify the Income instance.
      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'date',
          'description',
          'employer_uuid',
          'household_member_uuid',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
        }],
        where: {
          uuid: user1IncomeUuid,
        },
      });

      assert.isOk(income);
      assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income2.amount_cents);
      assert.strictEqual(income.get('date'), sampleData.incomes.income2.date);
      assert.strictEqual(income.get('description'), sampleData.incomes.income2.description);
      assert.strictEqual(income.get('employer_uuid'), user1Employer2Uuid);
      assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMember2Uuid);
      assert.strictEqual(income.HouseholdMember.get('uuid'), user1HouseholdMember2Uuid);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Income
          && updateInstance.get('uuid') === user1IncomeUuid;
      });
      assert.isOk(updateExpense);
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isNotOk(trackChangesParams.deleteList);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });
});
