const Sequelize = require('sequelize');

const Op = Sequelize.Op;

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /loans
   * @apiName LoanGet
   * @apiGroup Loan
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.loans
   * @apiSuccess (200) {object} data.loans[].attributes
   * @apiSuccess (200) {integer} data.loans[].attributes.amount
   * @apiSuccess (200) {integer} data.loans[].attributes.balance
   * @apiSuccess (200) {string} data.loans[].attributes[created-at]
   * @apiSuccess (200) {string} data.loans[].attributes.name
   * @apiSuccess (200) {string} data.loans[].id
   * @apiSuccess (200) {string} data.loans[].type
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

      const loanWhere = {
        household_uuid: user.get('household_uuid'),
      };

      if (req.query && req.query.search) {
        offset = 0;
        loanWhere.name = {
          [Op.iLike]: `%${req.query.search}%`,
        };
      }

      if (req.query && req.query.open && req.query.open === 'true') {
        loanWhere.balance_cents = {
          [Op.gt]: 0,
        };
      }

      const loans = await models.Loan.findAndCountAll({
        attributes: ['amount_cents', 'balance_cents', 'created_at', 'name', 'uuid'],
        limit,
        offset,
        order: [['name', 'ASC']],
        where: loanWhere,
      });

      return res.status(200).json({
        'data': loans.rows.map((loan) => {
          return {
            'attributes': {
              'amount': loan.get('amount_cents'),
              'balance': loan.get('balance_cents'),
              'created-at': loan.get('created_at'),
              'name': loan.get('name'),
            },
            'id': loan.get('uuid'),
            'type': 'loans',
          };
        }),
        'meta': {
          'pages': Math.ceil(loans.count / limit),
          'total': loans.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
