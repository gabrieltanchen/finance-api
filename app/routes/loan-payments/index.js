const { body } = require('express-validator');
const getFn = require('./get');
const postFn = require('./post');
const routeItem = require('./item');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    )
    .post(
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
      postFn(app),
    );

  routeItem(router, app);

  return router;
};
