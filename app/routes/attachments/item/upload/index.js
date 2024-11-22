import multer from 'multer';
import postFn from './post.js';

const upload = multer();

export default (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');

  return router.route('/:uuid/upload')
    .post(
      Authentication.UserAuth.can('access-account'),
      Auditor.trackApiCall(),
      upload.single('file'),
      postFn(app),
    );
};
