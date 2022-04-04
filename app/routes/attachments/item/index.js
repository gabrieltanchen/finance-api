const routeUpload = require('./upload');

module.exports = (router, app) => {
  routeUpload(router, app);

  return router;
};
