export default (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /loans/:uuid
   * @apiName LoanItemDelete
   * @apiGroup Loan
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
      await controllers.LoanCtrl.deleteLoan({
        auditApiCallUuid: req.auditApiCallUuid,
        loanUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
