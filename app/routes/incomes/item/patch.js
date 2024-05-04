module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /incomes/:uuid
   * @apiName IncomeItemPatch
   * @apiGroup Income
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {decimal} data.attributes.amount
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.date
   * @apiSuccess (200) {string} data.attributes.description
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {object} data.relationships
   * @apiSuccess (200) {object} data.relationships[household-member]
   * @apiSuccess (200) {object} data.relationships[household-member].data
   * @apiSuccess (200) {string} data.relatinoships[household-member].data.id
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
      let employerUuid = null;
      if (req.body.data.relationships
          && req.body.data.relationships.employer
          && req.body.data.relationships.employer.data
          && req.body.data.relationships.employer.data.id) {
        employerUuid = req.body.data.relationships.employer.data.id;
      }
      await controllers.IncomeCtrl.updateIncome({
        amount: req.body.data.attributes.amount,
        auditApiCallUuid: req.auditApiCallUuid,
        date: req.body.data.attributes.date,
        description: req.body.data.attributes.description,
        employerUuid,
        householdMemberUuid: req.body.data.relationships['household-member'].data.id,
        incomeUuid: req.params.uuid,
      });

      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'created_at',
          'date',
          'description',
          'uuid',
        ],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Employer,
          required: false,
        }, {
          attributes: ['name', 'uuid'],
          model: models.HouseholdMember,
          required: true,
        }],
        where: {
          uuid: req.params.uuid,
        },
      });

      const relationships = {
        'household-member': {
          'data': {
            'id': income.HouseholdMember.get('uuid'),
            'type': 'household-members',
          },
        },
      };
      if (income.Employer) {
        relationships.employer = {
          'data': {
            'id': income.Employer.get('uuid'),
            'type': 'employers',
          },
        };
      }

      return res.status(200).json({
        'data': {
          'attributes': {
            'amount': income.get('amount_cents'),
            'created-at': income.get('created_at'),
            'date': income.get('date'),
            'description': income.get('description'),
          },
          'id': income.get('uuid'),
          'relationships': relationships,
          'type': 'incomes',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
