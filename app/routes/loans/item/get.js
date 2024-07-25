const { LoanError } = require('../../../middleware/error-handler');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /loans/:uuid
   * @apiName LoanItemGet
   * @apiGroup Loan
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {integer} data.attributes.amount
   * @apiSuccess (200) {integer} data.attributes.balance
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.name
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
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const loan = await models.Loan.findOne({
        attributes: ['amount_cents', 'balance_cents', 'created_at', 'name', 'uuid'],
        where: {
          household_uuid: user.get('household_uuid'),
          uuid: req.params.uuid,
        },
      });
      if (!loan) {
        throw new LoanError('Not found');
      }

      const sumInterestAmountCents = await models.LoanPayment.sum('interest_amount_cents', {
        where: {
          loan_uuid: loan.get('uuid'),
        },
      });
      const sumPrincipalAmountCents = await models.LoanPayment.sum('principal_amount_cents', {
        where: {
          loan_uuid: loan.get('uuid'),
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'amount': loan.get('amount_cents'),
            'balance': loan.get('balance_cents'),
            'created-at': loan.get('created_at'),
            'name': loan.get('name'),
            'sum-interest-amount': sumInterestAmountCents || 0,
            'sum-principal-amount': sumPrincipalAmountCents || 0,
          },
          'id': loan.get('uuid'),
          'type': 'loans',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
