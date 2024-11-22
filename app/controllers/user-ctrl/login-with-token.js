import jwt from 'jsonwebtoken';
import nconf from 'nconf';

export default async({
  token,
  userCtrl,
}) => {
  return jwt.verify(token, nconf.get('jwtPrivateKey'), {
    algorithms: [userCtrl.jwtAlgorithm],
  });
};
