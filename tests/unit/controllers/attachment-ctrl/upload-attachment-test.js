const chai = require('chai');
const nconf = require('nconf');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { AttachmentError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - AttachmentCtrl.uploadAttachment', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let s3ClientSendStub;
  let trackChangesSpy;

  let user1AttachmentUuid;
  let user1ExpenseUuid;
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
    s3ClientSendStub = sinon.stub(controllers.AttachmentCtrl.s3Client, 'send');
  });

  after('restore sinon spies', function() {
    trackChangesSpy.restore();
    s3ClientSendStub.restore();
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
    user1ExpenseUuid = expense.get('uuid');
  });

  beforeEach('create user 1 attachment', async function() {
    const attachment = await models.Attachment.create({
      entity_type: 'expense',
      entity_uuid: user1ExpenseUuid,
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
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: null,
        auditApiCallUuid: apiCall.get('uuid'),
        fileBody: sampleData.attachments.attachment1.body,
        fileName: sampleData.attachments.attachment1.aws_key,
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

  it('should reject with no file name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: apiCall.get('uuid'),
        fileBody: sampleData.attachments.attachment1.body,
        fileName: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'File name is required');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no file body', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: apiCall.get('uuid'),
        fileBody: null,
        fileName: sampleData.attachments.attachment1.aws_key,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'File body is required');
      assert.isTrue(err instanceof AttachmentError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: null,
        fileBody: sampleData.attachments.attachment1.body,
        fileName: sampleData.attachments.attachment1.aws_key,
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
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: uuidv4(),
        fileBody: sampleData.attachments.attachment1.body,
        fileName: sampleData.attachments.attachment1.aws_key,
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
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: apiCall.get('uuid'),
        fileBody: sampleData.attachments.attachment1.body,
        fileName: sampleData.attachments.attachment1.aws_key,
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
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: uuidv4(),
        auditApiCallUuid: apiCall.get('uuid'),
        fileBody: sampleData.attachments.attachment1.body,
        fileName: sampleData.attachments.attachment1.aws_key,
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
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: apiCall.get('uuid'),
        fileBody: sampleData.attachments.attachment1.body,
        fileName: sampleData.attachments.attachment1.aws_key,
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

  it('should resolve and update the attachment', async function() {
    s3ClientSendStub.resolves({
      ContentLength: sampleData.attachments.attachment1.aws_content_length,
      ContentType: sampleData.attachments.attachment1.aws_content_type,
      ETag: sampleData.attachments.attachment1.aws_etag,
    });

    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.AttachmentCtrl.uploadAttachment({
      attachmentUuid: user1AttachmentUuid,
      auditApiCallUuid: apiCall.get('uuid'),
      fileBody: sampleData.attachments.attachment1.body,
      fileName: sampleData.attachments.attachment1.aws_key,
    });

    // Verify the Attachment instance.
    const attachment = await models.Attachment.findOne({
      attributes: [
        'aws_bucket',
        'aws_content_length',
        'aws_content_type',
        'aws_etag',
        'aws_key',
        'entity_type',
        'entity_uuid',
        'name',
        'uuid',
      ],
      where: {
        uuid: user1AttachmentUuid,
      },
    });
    assert.isOk(attachment);
    assert.strictEqual(attachment.get('aws_bucket'), nconf.get('AWS_STORAGE_BUCKET'));
    assert.strictEqual(attachment.get('aws_content_length'), sampleData.attachments.attachment1.aws_content_length);
    assert.strictEqual(attachment.get('aws_content_type'), sampleData.attachments.attachment1.aws_content_type);
    assert.strictEqual(attachment.get('aws_etag'), sampleData.attachments.attachment1.aws_etag);
    assert.include(attachment.get('aws_key'), sampleData.attachments.attachment1.aws_key);
    assert.strictEqual(attachment.get('entity_type'), 'expense');
    assert.strictEqual(attachment.get('entity_uuid'), user1ExpenseUuid);
    assert.strictEqual(attachment.get('name'), sampleData.attachments.attachment1.name);

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

  it('should reject when AWS S3 returns an error', async function() {
    s3ClientSendStub.throws(new Error('Could not upload file'));

    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.AttachmentCtrl.uploadAttachment({
        attachmentUuid: user1AttachmentUuid,
        auditApiCallUuid: apiCall.get('uuid'),
        fileBody: sampleData.attachments.attachment1.body,
        fileName: sampleData.attachments.attachment1.aws_key,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Could not upload file');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });
});
