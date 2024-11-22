export default (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /employers/:uuid
   * @apiName EmployerItemDelete
   * @apiGroup Employer
   *
   * @apiSuccess (204)
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
      await controllers.EmployerCtrl.deleteEmployer({
        auditApiCallUuid: req.auditApiCallUuid,
        employerUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
