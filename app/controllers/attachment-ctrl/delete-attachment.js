const Sequelize = require('sequelize');

const { AttachmentError } = require('../../middleware/error-handler');

/**
 * @param {object} attachmentCtrl Instance of AttachmentCtrl
 * @param {string} attachmentUuid UUID of attachment to delete
 * @param {string} auditApiCallUuid
 */
module.exports = async({
  attachmentCtrl,
  attachmentUuid,
  auditApiCallUuid,
}) => {
  const controllers = attachmentCtrl.parent;
  const models = attachmentCtrl.models;
  if (!attachmentUuid) {
    throw new AttachmentError('Attachment is required');
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

  const attachment = await models.Attachment.findOne({
    attributes: ['name', 'uuid'],
    include: [{
      as: 'Expense',
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
      model: models.Expense,
      required: true,
    }],
    where: {
      uuid: attachmentUuid,
    },
  });
  if (!attachment) {
    throw new AttachmentError('Not found');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [attachment],
      transaction,
    });
  });
};
