import getFn from './get.js';

export default (router, app) => {
  const Authentication = app.get('Authentication');

  router.route('/:uuid')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    );
};
