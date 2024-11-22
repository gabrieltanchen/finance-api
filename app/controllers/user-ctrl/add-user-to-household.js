import crypto from 'crypto';
import Sequelize from 'sequelize';
import _ from 'lodash';

import { UserError } from '../../middleware/error-handler/index.js';

export default async({
  auditApiCallUuid,
  email,
  firstName,
  lastName,
  password,
  userCtrl,
}) => {
  const controllers = userCtrl.parent;
  const models = userCtrl.models;
  if (!email || !_.isString(email)) {
    throw new UserError('Email is required');
  } else if (!firstName || !_.isString(firstName)) {
    throw new UserError('First name is required');
  } else if (!lastName || !_.isString(lastName)) {
    throw new UserError('Last name is required');
  } else if (!password || !_.isString(password)) {
    throw new UserError('Password is required');
  } else if (password.length < 8) {
    throw new UserError('Password must be at least 8 characters');
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
    attributes: ['uuid'],
    include: [{
      attributes: ['uuid'],
      model: models.Household,
      required: true,
    }],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new UserError('Not found');
  }

  if (await models.User.findOne({
    attributes: ['uuid'],
    where: {
      email: email.toLowerCase(),
    },
  })) {
    throw new UserError('Email already exists');
  }

  const newUser = models.User.build({
    email: email.toLowerCase(),
    first_name: firstName,
    household_uuid: user.Household.get('uuid'),
    last_name: lastName,
  });
  const newUserLogin = models.UserLogin.build({
    s1: crypto.randomBytes(48).toString('base64'),
  });
  const hash = await models.Hash.create({
    h1: (
      await crypto.scryptSync(password, newUserLogin.get('s1'), 96, userCtrl.hashParams)
    ).toString('base64'),
    s2: crypto.randomBytes(48).toString('base64'),
  });
  newUserLogin.set('h2', (
    await crypto.scryptSync(password, hash.get('s2'), 96, userCtrl.hashParams)
  ).toString('base64'));

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newUser.save({
      transaction,
    });
    newUserLogin.set('user_uuid', newUser.get('uuid'));
    await newUserLogin.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newUser, newUserLogin],
      transaction,
    });
  });

  return newUser.get('uuid');
};
