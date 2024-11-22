import { body } from 'express-validator';
import deleteFn from './delete.js';
import getFn from './get.js';
import patchFn from './patch.js';

export default (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/:uuid')
    .delete(
      Authentication.UserAuth.can('access-account'),
      Auditor.trackApiCall(),
      deleteFn(app),
    )
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    )
    .patch(
      Authentication.UserAuth.can('access-account'),
      [
        body([['data', 'attributes', 'amount']], 'Amount is required.').not().isEmpty(),
        body([['data', 'attributes', 'amount']], 'Amount must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'attributes', 'name']], 'Loan name is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      patchFn(app),
    );
};
