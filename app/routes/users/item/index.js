import { body } from 'express-validator';
import getFn from './get.js';
import patchFn from './patch.js';

export default (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/:uuid')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    )
    .patch(
      Authentication.UserAuth.can('access-account'),
      [
        body([['data', 'attributes', 'email']], 'Email address is required.').not().isEmpty(),
        body([['data', 'attributes', 'email']], 'Please enter a valid email address.').isEmail(),
        body([['data', 'attributes', 'first-name']], 'First name is required.').not().isEmpty(),
        body([['data', 'attributes', 'last-name']], 'Last name is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      patchFn(app),
    );
};
