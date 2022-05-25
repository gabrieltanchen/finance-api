const multer = require('multer');
const postFn = require('./post');

const upload = multer();

module.exports = (router, app) => {
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
