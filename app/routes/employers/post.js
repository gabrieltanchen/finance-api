export default (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /employers
   * @apiName EmployerPost
   * @apiGroup Employer
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.name
   * @apiParam {string} data.type
   *
   * @apiSuccess (201) {object} data
   * @apiSuccess (201) {object} data.attributes
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
   *        "detail": "Employer name is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const employerUuid = await controllers.EmployerCtrl.createEmployer({
        auditApiCallUuid: req.auditApiCallUuid,
        name: req.body.data.attributes.name,
      });

      const employer = await models.Employer.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: employerUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'created-at': employer.get('created_at'),
            'name': employer.get('name'),
          },
          'id': employer.get('uuid'),
          'type': 'employers',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
