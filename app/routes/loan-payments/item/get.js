import { LoanError } from '../../../middleware/error-handler/index.js';

export default (app) => {
  const models = app.get('models');

  /**
   * @api {get} /loan-payments/:uuid
   * @apiName LoanPaymentItemGet
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
   * @apiSuccess (200) {string} data.relatinoships.loan.data.type
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

      const loanPayment = await models.LoanPayment.findOne({
        attributes: ['created_at', 'date', 'interest_amount_cents', 'principal_amount_cents', 'uuid'],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Loan,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }],
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!loanPayment) {
        throw new LoanError('Loan payment not found');
      }

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
        'included': [{
          'attributes': {
            'name': loanPayment.Loan.get('name'),
          },
          'id': loanPayment.Loan.get('uuid'),
          'type': 'loans',
        }],
      });
    } catch (err) {
      return next(err);
    }
  };
};
