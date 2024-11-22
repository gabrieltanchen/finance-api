import Sequelize from 'sequelize';
import _ from 'lodash';

import { UserError } from '../../middleware/error-handler/index.js';

export default async({
  auditApiCallUuid,
  email,
  firstName,
  lastName,
  userCtrl,
  userUuid,
}) => {
  const controllers = userCtrl.parent;
  const models = userCtrl.models;
  if (!userUuid) {
    throw new UserError('User is required');
  } else if (!email || !_.isString(email)) {
    throw new UserError('Email is required');
  } else if (!firstName || !_.isString(firstName)) {
    throw new UserError('First name is required');
  } else if (!lastName || !_.isString(lastName)) {
    throw new UserError('Last name is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new UserError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new UserError('Audit user does not exist');
  }

  const updateUser = await models.User.findOne({
    attributes: [
      'email',
      'first_name',
      'household_uuid',
      'last_name',
      'uuid',
    ],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: userUuid,
    },
  });
  if (!updateUser) {
    throw new UserError('Not found');
  }

  if (email.toLowerCase() !== updateUser.get('email')) {
    updateUser.set('email', email.toLowerCase());
  }
  if (firstName !== updateUser.get('first_name')) {
    updateUser.set('first_name', firstName);
  }
  if (lastName !== updateUser.get('last_name')) {
    updateUser.set('last_name', lastName);
  }

  if (updateUser.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [updateUser],
        transaction,
      });
    });
  }
};
