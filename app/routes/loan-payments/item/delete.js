module.exports = (app) => {
  const controllers = app.get('controllers');

  return async(req, res, next) => {
    try {
      await controllers.LoanCtrl.deleteLoanPayment({
        auditApiCallUuid: req.auditApiCallUuid,
        loanPaymentUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
