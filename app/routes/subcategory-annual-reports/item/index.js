import getFn from './get.js';

export default (router, app) => {
  const Authentication = app.get('Authentication');

  return router.route('/:id')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    );
};
