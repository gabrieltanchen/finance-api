const { LoanError } = require('../../middleware/error-handler');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /loan-payments
   * @apiName LoanPaymentGet
   * @apiGroup LoanPayment
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

      const loanPaymentWhere = {};
      if (req.query.loan_id) {
        const loan = await models.Loan.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.loan_id,
          },
        });
        if (!loan) {
          throw new LoanError('Not found');
        }
        loanPaymentWhere.loan_uuid = loan.get('uuid');
      } else {
        throw new LoanError('No open loan payment queries');
      }

      let loanPaymentOrder = [['date', 'DESC']];
      let sortField = [];
      if (req.query.sort && req.query.sort === 'principal_amount') {
        sortField = ['principal_amount_cents'];
      } else if (req.query.sort && req.query.sort === 'interest_amount') {
        sortField = ['interest_amount_cents'];
      } else if (req.query.sort && req.query.sort === 'date') {
        sortField = ['date'];
      } else if (req.query.sort && req.query.sort === 'loan') {
        sortField = ['Loan', 'name'];
      }
      if (sortField.length) {
        loanPaymentOrder = [];
        if (req.query.sortDirection && req.query.sortDirection === 'desc') {
          loanPaymentOrder.push([...sortField, 'DESC']);
        } else {
          loanPaymentOrder.push([...sortField, 'ASC']);
        }
        if (sortField[0] !== 'date') {
          loanPaymentOrder.push(['date', 'DESC']);
        }
      }

      const loanPayments = await models.LoanPayment.findAndCountAll({
        attributes: [
          'created_at',
          'date',
          'interest_amount_cents',
          'principal_amount_cents',
          'uuid',
        ],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Loan,
          required: true,
        }],
        limit,
        offset,
        order: loanPaymentOrder,
        where: loanPaymentWhere,
      });

      const included = [];
      const loanIds = [];
      loanPayments.rows.forEach((loanPayment) => {
        if (!loanIds.includes(loanPayment.Loan.get('uuid'))) {
          loanIds.push(loanPayment.Loan.get('uuid'));
          included.push({
            'attributes': {
              'name': loanPayment.Loan.get('name'),
            },
            'id': loanPayment.Loan.get('uuid'),
            'type': 'loans',
          });
        }
      });

      return res.status(200).json({
        'data': loanPayments.rows.map((loanPayment) => {
          return {
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
          };
        }),
        'included': included,
        'meta': {
          'pages': Math.ceil(loanPayments.count / limit),
          'total': loanPayments.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
