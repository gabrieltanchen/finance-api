const getFn = require('./get');

const routeItem = require('./item');

module.exports = (router, app) => {
  const Authentication = app.get('Authentication');

  router.route('/')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    );

  routeItem(router, app);

  return router;
};
