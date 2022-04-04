const multer = require('multer');
const postFn = require('./post');

const upload = multer();

module.exports = (router, app) => {
  const Authentication = app.get('Authentication');

  return router.route('/:uuid/upload')
    .post(
      Authentication.UserAuth.can('access-account'),
      upload.single('file'),
      postFn(app),
    );
};
