import { EmployerError } from '../../../middleware/error-handler/index.js';

export default (app) => {
  const models = app.get('models');

  /**
   * @api {get} /employers/:uuid
   * @apiName EmployerItemGet
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
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const employer = await models.Employer.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          household_uuid: user.get('household_uuid'),
          uuid: req.params.uuid,
        },
      });
      if (!employer) {
        throw new EmployerError('Not found');
      }

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
