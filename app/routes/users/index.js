import { body } from 'express-validator';
import getFn from './get.js';
import postFn from './post.js';
import routeItem from './item/index.js';
import routeLogin from './login/index.js';

export default (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    )
    .post(
      [
        body([['data', 'attributes', 'email']], 'Email address is required.').not().isEmpty(),
        body([['data', 'attributes', 'email']], 'Please enter a valid email address.').isEmail(),
        body([['data', 'attributes', 'first-name']], 'First name is required.').not().isEmpty(),
        body([['data', 'attributes', 'last-name']], 'Last name is required.').not().isEmpty(),
        body([['data', 'attributes', 'password']], 'Passwords must be a minimum of 8 characters.').isLength({
          min: 8,
        }),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      postFn(app),
    );

  routeLogin(router, app);

  routeItem(router, app);

  return router;
};
