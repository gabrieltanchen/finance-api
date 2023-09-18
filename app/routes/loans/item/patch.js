module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /loans/:uuid
   * @apiName LoanItemPatch
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
      await controllers.LoanCtrl.updateLoan({
        amount: req.body.data.attributes.amount,
        auditApiCallUuid: req.auditApiCallUuid,
        loanUuid: req.params.uuid,
        name: req.body.data.attributes.name,
      });

      const loan = await models.Loan.findOne({
        attributes: ['amount_cents', 'balance_cents', 'created_at', 'name', 'uuid'],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
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
