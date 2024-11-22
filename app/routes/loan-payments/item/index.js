import { body } from 'express-validator';
import deleteFn from './delete.js';
import getFn from './get.js';
import patchFn from './patch.js';

export default (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  return router.route('/:uuid')
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
        body([['data', 'attributes', 'date']], 'Date is required.').not().isEmpty(),
        body([['data', 'attributes', 'date']], 'Date must be valid.').isISO8601(),
        body([['data', 'attributes', 'interest-amount']], 'Interest amount is required.').not().isEmpty(),
        body([['data', 'attributes', 'interest-amount']], 'Interest amount must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'attributes', 'principal-amount']], 'Principal amount is required.').not().isEmpty(),
        body([['data', 'attributes', 'principal-amount']], 'Principal amount must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'relationships', 'loan', 'data', 'id']], 'Loan is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      patchFn(app),
    );
};
