const { AttachmentError } = require('../../middleware/error-handler');

module.exports = async({
  attachmentCtrl,
  auditApiCallUuid,
  expenseUuid,
  name,
}) => {
  const controllers = attachmentCtrl.parent;
  const models = attachmentCtrl.models;
  if (!expenseUuid) {
    throw new AttachmentError('Expense is required');
  } else if !name) {
    throw new AttachmentError('Name is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new AttachmentError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new AttachmentError('Audit user does not exist');
  }

  // Validate expense belongs to household.
  const expense = await models.Expense.findOne({
    attributes: ['uuid'],
    include: [{
      attributes: ['uuid'],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
        where: {
          household_uuid: user.get('household_uuid'),
        },
      }],
      model: models.Subcategory,
      required: true,
    }],
    where: {
      uuid: expenseUuid,
    },
  });
  if (!expense) {
    throw new AttachmentError('Expense not found');
  }

  const newAttachment = models.Attachment.build({
    entity_type: 'expense',
    entity_uuid: expense.get('uuid'),
    name,
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newAttachment.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newAttachment],
      transaction,
    })
  });

  return newAttachment.get('uuid');
};
