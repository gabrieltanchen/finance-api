const Sequelize = require('sequelize');

const { EmployerError } = require('../../middleware/error-handler');

module.exports = async({
  auditApiCallUuid,
  employerCtrl,
  name,
}) => {
  const controllers = employerCtrl.parent;
  const models = employerCtrl.models;
  if (!name) {
    throw new EmployerError('Name is required');
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

  const newEmployer = models.Employer.build({
    household_uuid: user.get('household_uuid'),
    name,
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newEmployer.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newEmployer],
      transaction,
    });
  });

  return newEmployer.get('uuid');
};
