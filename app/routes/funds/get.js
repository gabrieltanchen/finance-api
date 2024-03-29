const Sequelize = require('sequelize');

const Op = Sequelize.Op;

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /funds
   * @apiName FundGet
   * @apiGroup Fund
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.funds
   * @apiSuccess (200) {object} data.funds[].attributes
   * @apiSuccess (200) {integer} data.funds[].attributes.balance
   * @apiSuccess (200) {string} data.funds[].attributes[created-at]
   * @apiSuccess (200) {string} data.funds[].attributes.name
   * @apiSuccess (200) {string} data.funds[].id
   * @apiSuccess (200) {string} data.funds[].type
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

      const fundWhere = {
        household_uuid: user.get('household_uuid'),
      };

      if (req.query && req.query.search) {
        offset = 0;
        fundWhere.name = {
          [Op.iLike]: `%${req.query.search}%`,
        };
      }

      const funds = await models.Fund.findAndCountAll({
        attributes: ['balance_cents', 'created_at', 'name', 'uuid'],
        limit,
        offset,
        order: [['name', 'ASC']],
        where: fundWhere,
      });

      return res.status(200).json({
        'data': funds.rows.map((fund) => {
          return {
            'attributes': {
              'balance': fund.get('balance_cents'),
              'created-at': fund.get('created_at'),
              'name': fund.get('name'),
            },
            'id': fund.get('uuid'),
            'type': 'funds',
          };
        }),
        'meta': {
          'pages': Math.ceil(funds.count / limit),
          'total': funds.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
