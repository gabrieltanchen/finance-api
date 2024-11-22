import jwt from 'jsonwebtoken';
import nconf from 'nconf';

import { UserError } from '../../middleware/error-handler/index.js';

export default async({
  userCtrl,
  userUuid,
}) => {
  const models = userCtrl.models;
  if (!userUuid) {
    throw new UserError('User UUID is required');
  }

  const user = await models.User.findOne({
    attributes: ['email', 'first_name', 'last_name', 'uuid'],
    where: {
      uuid: userUuid,
    },
  });
  if (!user) {
    throw new UserError('Not found');
  }

  return jwt.sign({
    email: user.get('email'),
    first_name: user.get('first_name'),
    last_name: user.get('last_name'),
    uuid: user.get('uuid'),
  }, nconf.get('jwtPrivateKey'), {
    algorithm: userCtrl.jwtAlgorithm,
    expiresIn: userCtrl.tokenExpiresIn,
  });
};
