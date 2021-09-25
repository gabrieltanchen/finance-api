module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /users
   * @apiName UserGet
   * @apiGroup User
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.users
   * @apiSuccess (200) {object} data.users[].attributes
   * @apiSuccess (200) {string} data.users[].attributes[created-at]
   * @apiSuccess (200) {string} data.users[].attributes.email
   * @apiSuccess (200) {string} data.users[].attributes[first-name]
   * @apiSuccess (200) {string} data.users[].attributes[last-name]
   * @apiSuccess (200) {string} data.users[].id
   * @apiSuccess (200) {string} data.users[].type
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
      // Query params
      let limit = 25;
      if (req.query && req.query.limit) {
        limit = parseInt(req.query.limit, 10);
      }
      let offset = 0;
      if (req.query && req.query.page) {
        offset = limit * (parseInt(req.query.page, 10) - 1);
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });

      const users = await models.User.findAndCountAll({
        attributes: ['created_at', 'email', 'first_name', 'last_name', 'uuid'],
        limit,
        offset,
        order: [['first_name', 'ASC'], ['last_name', 'ASC']],
        where: {
          household_uuid: user.get('household_uuid'),
        },
      });

      return res.status(200).json({
        'data': users.rows.map((u) => {
          return {
            'attributes': {
              'created-at': u.get('created_at'),
              'email': u.get('email'),
              'first-name': u.get('first_name'),
              'last-name': u.get('last_name'),
            },
            'id': u.get('uuid'),
            'type': 'users',
          };
        }),
        'meta': {
          'pages': Math.ceil(users.count / limit),
          'total': users.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
