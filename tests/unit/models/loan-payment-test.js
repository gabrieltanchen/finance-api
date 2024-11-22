import chai from 'chai';
import TestHelper from '../../test-helper/index.js';

const assert = chai.assert;

describe('Unit:Model - LoanPayment', function() {
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
    assert.strictEqual(models.LoanPayment.getTableName(), 'loan_payments');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.LoanPayment.describe();

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

    // loan_uuid
    assert.isOk(attributes.loan_uuid);
    assert.strictEqual(attributes.loan_uuid.type, 'UUID');
    assert.isFalse(attributes.loan_uuid.allowNull);
    assert.isNull(attributes.loan_uuid.defaultValue);
    assert.isFalse(attributes.loan_uuid.primaryKey);

    // date
    assert.isOk(attributes.date);
    assert.strictEqual(attributes.date.type, 'DATE');
    assert.isFalse(attributes.date.allowNull);
    assert.isNull(attributes.date.defaultValue);
    assert.isFalse(attributes.date.primaryKey);

    // principal_amount_cents
    assert.isOk(attributes.principal_amount_cents);
    assert.strictEqual(attributes.principal_amount_cents.type, 'INTEGER');
    assert.isFalse(attributes.principal_amount_cents.allowNull);
    assert.isNull(attributes.principal_amount_cents.defaultValue);
    assert.isFalse(attributes.principal_amount_cents.primaryKey);

    // interest_amount_cents
    assert.isOk(attributes.interest_amount_cents);
    assert.strictEqual(attributes.interest_amount_cents.type, 'INTEGER');
    assert.isFalse(attributes.interest_amount_cents.allowNull);
    assert.isNull(attributes.interest_amount_cents.defaultValue);
    assert.isFalse(attributes.interest_amount_cents.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 8);
  });
});
