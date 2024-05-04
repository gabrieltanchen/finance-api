const Sequelize = require('sequelize');

const { EmployerError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} employerCtrl Instance of EmployerCtrl
 * @param {string} employerUuid UUID of the employer to delete
 */
module.exports = async({
  auditApiCallUuid,
  employerCtrl,
  employerUuid,
}) => {
  const controllers = employerCtrl.parent;
  const models = employerCtrl.models;
  if (!employerUuid) {
    throw new EmployerError('Employer is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new EmployerError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new EmployerError('Audit user does not exist');
  }

  const employer = await models.Employer.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: employerUuid,
    },
  });
  if (!employer) {
    throw new EmployerError('Not found');
  }

  // Search for any incomes. If any exist, don't allow deletion.
  const incomeCount = await models.Income.count({
    where: {
      employer_uuid: employer.get('uuid'),
    },
  });
  if (incomeCount > 0) {
    throw new EmployerError('Cannot delete with incomes.');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [employer],
      transaction,
    });
  });
};
