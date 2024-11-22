import chai from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';
import { ExpenseError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Controllers - ExpenseCtrl.deleteExpense', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let s3ClientSendMock;
  let trackChangesSpy;

  let user1ExpenseUuid;
  let user1HouseholdMemberUuid;
  let user1HouseholdUuid;
  let user1SubcategoryUuid;
  let user1Uuid;
  let user1VendorUuid;
  let user2HouseholdMemberUuid;
  let user2HouseholdUuid;
  let user2SubcategoryUuid;
  let user2Uuid;
  let user2VendorUuid;

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  before('create sinon spies', function() {
    trackChangesSpy = sinon.spy(controllers.AuditCtrl, 'trackChanges');
    s3ClientSendMock = sinon.mock(controllers.AttachmentCtrl.s3Client);
  });

  after('restore sinon spies', function() {
    trackChangesSpy.restore();
    s3ClientSendMock.restore();
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

  beforeEach('create user 1 subcategory', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category2.name,
    });
    user1SubcategoryUuid = subcategory.get('uuid');
  });

  beforeEach('create user 1 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor1.name,
    });
    user1VendorUuid = vendor.get('uuid');
  });

  beforeEach('create user 1 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user1.firstName,
    });
    user1HouseholdMemberUuid = householdMember.get('uuid');
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

  beforeEach('create user 2 subcategory', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category3.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category4.name,
    });
    user2SubcategoryUuid = subcategory.get('uuid');
  });

  beforeEach('create user 2 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor2.name,
    });
    user2VendorUuid = vendor.get('uuid');
  });

  beforeEach('create user 2 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.users.user2.firstName,
    });
    user2HouseholdMemberUuid = householdMember.get('uuid');
  });

  beforeEach('create user 1 expense', async function() {
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      household_member_uuid: user1HouseholdMemberUuid,
      reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
      subcategory_uuid: user1SubcategoryUuid,
      vendor_uuid: user1VendorUuid,
    });
    user1ExpenseUuid = expense.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no expense UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Expense is required');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: null,
        expenseUuid: user1ExpenseUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: uuidv4(),
        expenseUuid: user1ExpenseUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof ExpenseError);
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
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense subcategory belongs to a different household', async function() {
    try {
      await models.Expense.update({
        subcategory_uuid: user2SubcategoryUuid,
      }, {
        where: {
          uuid: user1ExpenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense vendor belongs to a different household', async function() {
    try {
      await models.Expense.update({
        vendor_uuid: user2VendorUuid,
      }, {
        where: {
          uuid: user1ExpenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense household member belongs to a different household', async function() {
    try {
      await models.Expense.update({
        household_member_uuid: user2HouseholdMemberUuid,
      }, {
        where: {
          uuid: user1ExpenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve when the expense belongs to the user\'s household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.deleteExpense({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1ExpenseUuid,
    });

    // Verify that the Expense instance is deleted.
    assert.isNull(await models.Expense.findOne({
      attributes: ['uuid'],
      where: {
        uuid: user1ExpenseUuid,
      },
    }));

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isOk(trackChangesParams.deleteList);
    assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.Expense
        && deleteInstance.get('uuid') === user1ExpenseUuid;
    }));
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when deleting an expense with a fund', function() {
    const FUND_INITIAL_BALANCE = 100000;

    let user1FundUuid;
    let user2FundUuid;

    beforeEach('create user 1 fund', async function() {
      const fund = await models.Fund.create({
        balance_cents: FUND_INITIAL_BALANCE,
        household_uuid: user1HouseholdUuid,
        name: sampleData.funds.fund1.name,
      });
      user1FundUuid = fund.get('uuid');
    });

    beforeEach('create user 2 fund', async function() {
      const fund = await models.Fund.create({
        household_uuid: user2HouseholdUuid,
        name: sampleData.funds.fund2.name,
      });
      user2FundUuid = fund.get('uuid');
    });

    beforeEach('update expense to belong to fund', async function() {
      await models.Expense.update({
        fund_uuid: user1FundUuid,
      }, {
        where: {
          uuid: user1ExpenseUuid,
        },
      });
    });

    // This should not happen.
    it('should reject when the expense fund belongs to a different household', async function() {
      try {
        await models.Expense.update({
          fund_uuid: user2FundUuid,
        }, {
          where: {
            uuid: user1ExpenseUuid,
          },
        });
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.deleteExpense({
          auditApiCallUuid: apiCall.get('uuid'),
          expenseUuid: user1ExpenseUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Not found');
        assert.isTrue(err instanceof ExpenseError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve and update the fund balance', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });

      // Verify that the Expense instance is deleted.
      assert.isNull(await models.Expense.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1ExpenseUuid,
        },
      }));

      // Verify that the Fund balance was updated.
      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        where: {
          uuid: user1FundUuid,
        },
      });
      assert.isOk(fund);
      assert.strictEqual(
        fund.get('balance_cents'),
        FUND_INITIAL_BALANCE + (
          sampleData.expenses.expense1.amount_cents
            - sampleData.expenses.expense1.reimbursed_cents
        ),
      );

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isOk(trackChangesParams.changeList);
      assert.isOk(_.find(trackChangesParams.changeList, (updateInstance) => {
        return updateInstance instanceof models.Fund
          && updateInstance.get('uuid') === user1FundUuid;
      }));
      assert.strictEqual(trackChangesParams.changeList.length, 1);
      assert.isOk(trackChangesParams.deleteList);
      assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Expense
          && deleteInstance.get('uuid') === user1ExpenseUuid;
      }));
      assert.strictEqual(trackChangesParams.deleteList.length, 1);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });

  describe('when deleting an expense with an attachment', function() {
    let user1AttachmentUuid;

    beforeEach('create user 1 attachment', async function() {
      const attachment = await models.Attachment.create({
        aws_bucket: sampleData.attachments.attachment1.aws_bucket,
        aws_content_length: sampleData.attachments.attachment1.aws_content_length,
        aws_content_type: sampleData.attachments.attachment1.aws_content_type,
        aws_etag: sampleData.attachments.attachment1.aws_etag,
        aws_key: sampleData.attachments.attachment1.aws_key,
        entity_type: 'expense',
        entity_uuid: user1ExpenseUuid,
        name: sampleData.attachments.attachment1.name,
      });
      user1AttachmentUuid = attachment.get('uuid');
    });

    it('should resolve and delete the attachment in db and AWS', async function() {
      s3ClientSendMock.expects('send').once().resolves();

      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });

      // Verify that the Expense instance is deleted.
      assert.isNull(await models.Expense.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1ExpenseUuid,
        },
      }));

      // Verify that the Attachment instance is deleted.
      assert.isNull(await models.Attachment.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1AttachmentUuid,
        },
      }));

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Expense
          && deleteInstance.get('uuid') === user1ExpenseUuid;
      }));
      assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Attachment
          && deleteInstance.get('uuid') === user1AttachmentUuid;
      }));
      assert.strictEqual(trackChangesParams.deleteList.length, 2);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });

  describe('when deleting an expense with a missing attachment', function() {
    let user1AttachmentUuid;

    beforeEach('create user 1 attachment', async function() {
      const attachment = await models.Attachment.create({
        entity_type: 'expense',
        entity_uuid: user1ExpenseUuid,
        name: sampleData.attachments.attachment1.name,
      });
      user1AttachmentUuid = attachment.get('uuid');
    });

    it('should resolve and delete the attachment in db and not call AWS', async function() {
      s3ClientSendMock.expects('send').never();

      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });

      // Verify that the Expense instance is deleted.
      assert.isNull(await models.Expense.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1ExpenseUuid,
        },
      }));

      // Verify that the Attachment instance is deleted.
      assert.isNull(await models.Attachment.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1AttachmentUuid,
        },
      }));

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Expense
          && deleteInstance.get('uuid') === user1ExpenseUuid;
      }));
      assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Attachment
          && deleteInstance.get('uuid') === user1AttachmentUuid;
      }));
      assert.strictEqual(trackChangesParams.deleteList.length, 2);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });

  describe('when deleting an expense with multiple attachments', function() {
    let user1Attachment1Uuid;
    let user1Attachment2Uuid;

    beforeEach('create user 1 attachment 1', async function() {
      user1Attachment1Uuid = (await models.Attachment.create({
        aws_bucket: sampleData.attachments.attachment1.aws_bucket,
        aws_content_length: sampleData.attachments.attachment1.aws_content_length,
        aws_content_type: sampleData.attachments.attachment1.aws_content_type,
        aws_etag: sampleData.attachments.attachment1.aws_etag,
        aws_key: sampleData.attachments.attachment1.aws_key,
        entity_type: 'expense',
        entity_uuid: user1ExpenseUuid,
        name: sampleData.attachments.attachment1.name,
      })).get('uuid');
    });

    beforeEach('create user 1 attachment 2', async function() {
      user1Attachment2Uuid = (await models.Attachment.create({
        aws_bucket: sampleData.attachments.attachment2.aws_bucket,
        aws_content_length: sampleData.attachments.attachment2.aws_content_length,
        aws_content_type: sampleData.attachments.attachment2.aws_content_type,
        aws_etag: sampleData.attachments.attachment2.aws_etag,
        aws_key: sampleData.attachments.attachment2.aws_key,
        entity_type: 'expense',
        entity_uuid: user1ExpenseUuid,
        name: sampleData.attachments.attachment2.name,
      })).get('uuid');
    });

    it('should resolve and delete the attachments in db and AWS', async function() {
      s3ClientSendMock.expects('send').twice().resolves();

      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: user1ExpenseUuid,
      });

      // Verify that the Expense instance is deleted.
      assert.isNull(await models.Expense.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1ExpenseUuid,
        },
      }));

      // Verify that the Attachment instances are deleted.
      assert.isNull(await models.Attachment.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1Attachment1Uuid,
        },
      }));
      assert.isNull(await models.Attachment.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1Attachment2Uuid,
        },
      }));

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Expense
          && deleteInstance.get('uuid') === user1ExpenseUuid;
      }));
      assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Attachment
          && deleteInstance.get('uuid') === user1Attachment1Uuid;
      }));
      assert.isOk(_.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Attachment
          && deleteInstance.get('uuid') === user1Attachment2Uuid;
      }));
      assert.strictEqual(trackChangesParams.deleteList.length, 3);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });
});
