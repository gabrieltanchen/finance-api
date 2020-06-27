const { body } = require('express-validator');
const deleteFn = require('./delete');
const getFn = require('./get');
const patchFn = require('./patch');

module.exports = (router, app) => {
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
        body([['data', 'attributes', 'amount']], 'Amount is required.').not().isEmpty(),
        body([['data', 'attributes', 'amount']], 'Amount must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'attributes', 'date']], 'Date is required.').not().isEmpty(),
        body([['data', 'attributes', 'date']], 'Date must be valid.').isISO8601(),
        body([['data', 'attributes', 'reimbursed-amount']], 'Reimbursed amount is required.').not().isEmpty(),
        body([['data', 'attributes', 'reimbursed-amount']], 'Reimbursed amount must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'relationships', 'household-member', 'data', 'id']], 'Member is required.').not().isEmpty(),
        body([['data', 'relationships', 'subcategory', 'data', 'id']], 'Subcategory is required.').not().isEmpty(),
        body([['data', 'relationships', 'vendor', 'data', 'id']], 'Vendor is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      patchFn(app),
    );
};
