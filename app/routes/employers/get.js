const Sequelize = require('sequelize');

const Op = Sequelize.Op;

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /employers
   * @apiName EmployerGet
   * @apiGroup Employer
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.employers
   * @apiSuccess (200) {object} data.employers[].attributes
   * @apiSuccess (200) {string} data.employers[].attributes[created-at]
   * @apiSuccess (200) {string} data.employers[].attributes.name
   * @apiSuccess (200) {string} data.employers[].id
   * @apiSuccess (200) {string} data.employers[].type
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

      const employerWhere = {
        household_uuid: user.get('household_uuid'),
      };

      if (req.query && req.query.search) {
        offset = 0;
        employerWhere.name = {
          [Op.iLike]: `%${req.query.search}%`,
        };
      }

      const employers = await models.Employer.findAndCountAll({
        attributes: ['created_at', 'name', 'uuid'],
        limit,
        offset,
        order: [['name', 'ASC']],
        where: employerWhere,
      });

      return res.status(200).json({
        'data': employers.rows.map((employer) => {
          return {
            'attributes': {
              'created-at': employer.get('created_at'),
              'name': employer.get('name'),
            },
            'id': employer.get('uuid'),
            'type': 'employers',
          };
        }),
        'meta': {
          'pages': Math.ceil(employers.count / limit),
          'total': employers.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
