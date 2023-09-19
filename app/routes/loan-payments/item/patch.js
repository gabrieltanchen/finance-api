module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /loan-payments/:uuid
   * @apiName LoanPaymentItemPatch
   * @apiGroup LoanPayment
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.date
   * @apiSuccess (200) {integer} data.attributes[interest-amount]
   * @apiSuccess (200) {integer} data.attributes[principal-amount]
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {object} data.relationships
   * @apiSuccess (200) {object} data.relationships.loan
   * @apiSuccess (200) {object} data.relationships.loan.data
   * @apiSuccess (200) {string} data.relationships.loan.data.id
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
      await controllers.LoanCtrl.updateLoanPayment({
        auditApiCallUuid: req.auditApiCallUuid,
        date: req.body.data.attributes.date,
        interestAmount: req.body.data.attributes['interest-amount'],
        loanPaymentUuid: req.params.uuid,
        loanUuid: req.body.data.relationships.loan.data.id,
        principalAmount: req.body.data.attributes['principal-amount'],
      });

      const loanPayment = await models.LoanPayment.findOne({
        attributes: ['created_at', 'date', 'interest_amount_cents', 'principal_amount_cents', 'uuid'],
        include: [{
          attributes: ['uuid'],
          model: models.Loan,
          required: true,
        }],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': loanPayment.get('created_at'),
            'date': loanPayment.get('date'),
            'interest-amount': loanPayment.get('interest_amount_cents'),
            'principal-amount': loanPayment.get('principal_amount_cents'),
          },
          'id': loanPayment.get('uuid'),
          'relationships': {
            'loan': {
              'data': {
                'id': loanPayment.Loan.get('uuid'),
                'type': 'loans',
              },
            },
          },
          'type': 'loan-payments',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
