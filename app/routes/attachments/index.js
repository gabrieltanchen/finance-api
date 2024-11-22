import { body } from 'express-validator';
import getFn from './get.js';
import postFn from './post.js';

import routeItem from './item/index.js';

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
      Authentication.UserAuth.can('access-account'),
      [
        body([['data', 'attributes', 'name']], 'Attachment name is required.').not().isEmpty(),
        body([['data', 'relationships', 'expense', 'data', 'id']], 'Expense is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      postFn(app),
    );

  routeItem(router, app);

  return router;
};
