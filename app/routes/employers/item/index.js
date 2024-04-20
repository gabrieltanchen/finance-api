const { body } = require('express-validator');
const patchFn = require('./patch');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/:uuid')
    .patch(
      Authentication.UserAuth.can('access-account'),
      [
        body([['data', 'attributes', 'name']], 'Employer name is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      patchFn(app),
    );
};
