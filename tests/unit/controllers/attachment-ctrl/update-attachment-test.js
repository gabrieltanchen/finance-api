import chai from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import sampleData from '../../../sample-data/index.js';
import TestHelper from '../../../test-helper/index.js';
import { AttachmentError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Controllers - AttachmentCtrl.updateAttachment', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1AttachmentUuid;
  let user1Expense1Uuid;
  let user1Expense2Uuid;
  let user1HouseholdMemberUuid;
  let user1HouseholdUuid;
  let user1SubcategoryUuid;
  let user1Uuid;
  let user1VendorUuid;
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

  beforeEach('create user 1 expense 1', async function() {
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      household_member_uuid: user1HouseholdMemberUuid,
      reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
      subcategory_uuid: user1SubcategoryUuid,
      vendor_uuid: user1VendorUuid,
    });
    user1Expense1Uuid = expense.get('uuid');
  });

  beforeEach('create user 1 expense 2', async function() {
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense2.amount_cents,
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense2.description,
      household_member_uuid: user1HouseholdMemberUuid,
      reimbursed_cents: sampleData.expenses.expense2.reimbursed_cents,
      subcategory_uuid: user1SubcategoryUuid,
      vendor_uuid: user1VendorUuid,
    });
    user1Expense2Uuid = expense.get('uuid');
  });

  beforeEach('create user 1 attachment', async function() {
    const attachment = await models.Attachment.create({
      entity_type: 'expense',
      entity_uuid: user1Expense1Uuid,
      name: sampleData.attachments.attachment1.name,
    });
    user1AttachmentUuid = attachment.get('uuid');
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

  it('should reject with no attachment UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.updateAttachment({
        attachmentUuid: null,
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.attachments.attachment2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Attachment is required');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.updateAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: apiCall.get('uuid'),
        name: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Name is required');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.AttachmentCtrl.updateAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: null,
        name: sampleData.attachments.attachment2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.AttachmentCtrl.updateAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: uuidv4(),
        name: sampleData.attachments.attachment2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof AttachmentError);
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
      await controllers.AttachmentCtrl.updateAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.attachments.attachment2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the attachment does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.updateAttachment({
        attachmentUuid: uuidv4(),
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.attachments.attachment2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the attachment belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.AttachmentCtrl.updateAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.attachments.attachment2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.AttachmentCtrl.updateAttachment({
      attachmentUuid: user1AttachmentUuid,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.attachments.attachment1.name,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the attachment name', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.AttachmentCtrl.updateAttachment({
      attachmentUuid: user1AttachmentUuid,
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.attachments.attachment2.name,
    });

    // Verify the Attachment instance.
    const attachment = await models.Attachment.findOne({
      attributes: ['entity_type', 'entity_uuid', 'name', 'uuid'],
      where: {
        uuid: user1AttachmentUuid,
      },
    });
    assert.isOk(attachment);
    assert.strictEqual(attachment.get('entity_type'), 'expense');
    assert.strictEqual(attachment.get('entity_uuid'), user1Expense1Uuid);
    assert.strictEqual(attachment.get('name'), sampleData.attachments.attachment2.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateAttachment = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Attachment
        && updateInstance.get('uuid') === user1AttachmentUuid;
    });
    assert.isOk(updateAttachment);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should ignore trying to update the expense', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.AttachmentCtrl.updateAttachment({
      attachmentUuid: user1AttachmentUuid,
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid: user1Expense2Uuid,
      name: sampleData.attachments.attachment1.name,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });
});
