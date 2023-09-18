module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /loan-payments
   * @apiName LoanPaymentPost
   * @apiGroup LoanPayment
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.date
   * @apiParam {integer} data.attributes[interest-amount]
   * @apiParam {integer} data.attributes[principal-amount]
   * @apiParam {object} data.relationships
   * @apiParam {object} data.relationships.loan
   * @apiParam {object} data.relationships.loan.data
   * @apiParam {string} data.relationships.loan.data.id
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/interest-amount",
   *        },
   *        "detail": "Interest amount is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const loanPaymentUuid = await controllers.LoanCtrl.createLoanPayment({
        auditApiCallUuid: req.auditApiCallUuid,
        date: req.body.data.attributes.date,
        interestAmount: req.body.data.attributes['interest-amount'],
        loanUuid: req.body.data.relationships.loan.data.id,
        principalAmount: req.body.data.attributes['principal-amount'],
      });

      const loanPayment = await models.LoanPayment.findOne({
        attributes: ['created_at', 'date', 'interest_amount_cents', 'principal_amount_cents', 'uuid'],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Loan,
          required: true,
        }],
        where: {
          uuid: loanPaymentUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'created-at': loanPayment.get('created_at'),
            'date': loanPayment.get('date'),
            'interest-amount': loanPayment.get('interest_amount_cents'),
            'principal-amount': loanPayment.get('principal_amount_cents'),
          },
          'id': loanPaymentUuid,
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
