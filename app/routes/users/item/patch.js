export default (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /users/:uuid
   * @apiName UserItemPatch
   * @apiGroup User
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.email
   * @apiSuccess (200) {string} data.attributes[first-name]
   * @apiSuccess (200) {string} data.attributes[last-name]
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "detail": "Unauthorized",
   *      }],
   *    }
   */
  return async(req, res, next) => {
    try {
      await controllers.UserCtrl.updateUserDetails({
        auditApiCallUuid: req.auditApiCallUuid,
        email: req.body.data.attributes.email,
        firstName: req.body.data.attributes['first-name'],
        lastName: req.body.data.attributes['last-name'],
        userUuid: req.params.uuid,
      });

      const user = await models.User.findOne({
        attributes: [
          'created_at',
          'email',
          'first_name',
          'last_name',
          'uuid',
        ],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': user.get('created_at'),
            'email': user.get('email'),
            'first-name': user.get('first_name'),
            'last-name': user.get('last_name'),
          },
          'id': user.get('uuid'),
          'type': 'users',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
