import { body } from 'express-validator';
import postFn from './post.js';

export default (router, app) => {
  const Validator = app.get('Validator');

  router.route('/login/token')
    .post(
      [
        body([['data', 'attributes', 'token']], 'No token provided.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      postFn(app),
    );
};
