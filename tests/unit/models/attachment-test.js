import chai from 'chai';
import TestHelper from '../../test-helper/index.js';

const assert = chai.assert;

describe('Unit:Model - Attachment', function() {
  let models;
  const testHelper = new TestHelper();

  before('get models', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    models = app.get('models');
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should have the correct table name', function() {
    assert.strictEqual(models.Attachment.getTableName(), 'attachments');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.Attachment.describe();

    assert.isOk(attributes);

    // uuid
    assert.isOk(attributes.uuid);
    assert.strictEqual(attributes.uuid.type, 'UUID');
    assert.isFalse(attributes.uuid.allowNull);
    assert.isNull(attributes.uuid.defaultValue);
    assert.isTrue(attributes.uuid.primaryKey);

    // created_at
    assert.isOk(attributes.created_at);
    assert.strictEqual(attributes.created_at.type, 'TIMESTAMP WITH TIME ZONE');
    assert.isFalse(attributes.created_at.allowNull);
    assert.isNull(attributes.created_at.defaultValue);
    assert.isFalse(attributes.created_at.primaryKey);

    // updated_at
    assert.isOk(attributes.updated_at);
    assert.strictEqual(attributes.updated_at.type, 'TIMESTAMP WITH TIME ZONE');
    assert.isFalse(attributes.updated_at.allowNull);
    assert.isNull(attributes.updated_at.defaultValue);
    assert.isFalse(attributes.updated_at.primaryKey);

    // deleted_at
    assert.isOk(attributes.deleted_at);
    assert.strictEqual(attributes.deleted_at.type, 'TIMESTAMP WITH TIME ZONE');
    assert.isTrue(attributes.deleted_at.allowNull);
    assert.isNull(attributes.deleted_at.defaultValue);
    assert.isFalse(attributes.deleted_at.primaryKey);

    // entity_type
    assert.isOk(attributes.entity_type);
    assert.strictEqual(attributes.entity_type.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.entity_type.allowNull);
    assert.isNull(attributes.entity_type.defaultValue);
    assert.isFalse(attributes.entity_type.primaryKey);

    // entity_uuid
    assert.isOk(attributes.entity_uuid);
    assert.strictEqual(attributes.entity_uuid.type, 'UUID');
    assert.isFalse(attributes.entity_uuid.allowNull);
    assert.isNull(attributes.entity_uuid.defaultValue);
    assert.isFalse(attributes.entity_uuid.primaryKey);

    // name
    assert.isOk(attributes.name);
    assert.strictEqual(attributes.name.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.name.allowNull);
    assert.isNull(attributes.name.defaultValue);
    assert.isFalse(attributes.name.primaryKey);

    // aws_bucket
    assert.isOk(attributes.aws_bucket);
    assert.strictEqual(attributes.aws_bucket.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.aws_bucket.allowNull);
    assert.isNull(attributes.aws_bucket.defaultValue);
    assert.isFalse(attributes.aws_bucket.primaryKey);

    // aws_key
    assert.isOk(attributes.aws_key);
    assert.strictEqual(attributes.aws_key.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.aws_key.allowNull);
    assert.isNull(attributes.aws_key.defaultValue);
    assert.isFalse(attributes.aws_key.primaryKey);

    // aws_content_length
    assert.isOk(attributes.aws_content_length);
    assert.strictEqual(attributes.aws_content_length.type, 'BIGINT');
    assert.isTrue(attributes.aws_content_length.allowNull);
    assert.isNull(attributes.aws_content_length.defaultValue);
    assert.isFalse(attributes.aws_content_length.primaryKey);

    // aws_content_type
    assert.isOk(attributes.aws_content_type);
    assert.strictEqual(attributes.aws_content_type.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.aws_content_type.allowNull);
    assert.isNull(attributes.aws_content_type.defaultValue);
    assert.isFalse(attributes.aws_content_type.primaryKey);

    // aws_etag
    assert.isOk(attributes.aws_etag);
    assert.strictEqual(attributes.aws_etag.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.aws_etag.allowNull);
    assert.isNull(attributes.aws_etag.defaultValue);
    assert.isFalse(attributes.aws_etag.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 12);
  });
});
