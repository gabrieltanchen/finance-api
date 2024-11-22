import Sequelize from 'sequelize';

import { EmployerError } from '../../middleware/error-handler/index.js';

/**
 * @param {string} auditApiCallUuid
 * @param {object} employerCtrl
 * @param {string} employerUuid
 * @param {string} name
 */
export default async({
  auditApiCallUuid,
  employerCtrl,
  employerUuid,
  name,
}) => {
  const controllers = employerCtrl.parent;
  const models = employerCtrl.models;
  if (!employerUuid) {
    throw new EmployerError('Employer is required');
  } else if (!name) {
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

  const employer = await models.Employer.findOne({
    attributes: ['name', 'uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: employerUuid,
    },
  });
  if (!employer) {
    throw new EmployerError('Not found');
  }

  if (name !== employer.get('name')) {
    employer.set('name', name);
  }

  if (employer.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [employer],
        transaction,
      });
    });
  }
};
