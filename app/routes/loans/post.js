export default (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /loans
   * @apiName LoanPost
   * @apiGroup Loan
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {integer} data.attributes.amount
   * @apiParam {string} data.attributes.name
   * @apiParam {string} data.type
   *
   * @apiSuccess (201) {object} data
   * @apiSuccess (201) {object} data.attributes
   * @apiSuccess (201) {integer} data.attributes.amount
   * @apiSuccess (201) {integer} data.attributes.balance
   * @apiSuccess (201) {string} data.attributes[created-at]
   * @apiSuccess (201) {string} data.attributes.name
   * @apiSuccess (201) {string} data.id
   * @apiSuccess (201) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/name",
   *        },
   *        "detail": "Loan name is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const loanUuid = await controllers.LoanCtrl.createLoan({
        amount: req.body.data.attributes.amount,
        auditApiCallUuid: req.auditApiCallUuid,
        name: req.body.data.attributes.name,
      });

      const loan = await models.Loan.findOne({
        attributes: ['amount_cents', 'balance_cents', 'created_at', 'name', 'uuid'],
        where: {
          uuid: loanUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'amount': loan.get('amount_cents'),
            'balance': loan.get('balance_cents'),
            'created-at': loan.get('created_at'),
            'name': loan.get('name'),
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
