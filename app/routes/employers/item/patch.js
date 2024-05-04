module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /employers/:uuid
   * @apiName EmployerItemPatch
   * @apiGroup Employer
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
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
      await controllers.EmployerCtrl.updateEmployer({
        auditApiCallUuid: req.auditApiCallUuid,
        employerUuid: req.params.uuid,
        name: req.body.data.attributes.name,
      });

      const employer = await models.Employer.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
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
