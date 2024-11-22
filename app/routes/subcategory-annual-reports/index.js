import getFn from './get.js';
import routeItem from './item/index.js';

export default (router, app) => {
  const Authentication = app.get('Authentication');

  router.route('/')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    );

  routeItem(router, app);

  return router;
};
