const AttachmentError = require('./attachment-error');
const AuditError = require('./audit-error');
const BudgetError = require('./budget-error');
const CategoryError = require('./category-error');
const EmployerError = require('./employer-error');
const ExpenseError = require('./expense-error');
const FundError = require('./fund-error');
const HouseholdError = require('./household-error');
const IncomeError = require('./income-error');
const LoanError = require('./loan-error');
const LoginPasswordFailedError = require('./login-password-failed-error');
const UserError = require('./user-error');
const VendorError = require('./vendor-error');

const errorClasses = {
  AttachmentError,
  AuditError,
  BudgetError,
  CategoryError,
  EmployerError,
  ExpenseError,
  FundError,
  HouseholdError,
  IncomeError,
  LoanError,
  LoginPasswordFailedError,
  UserError,
  VendorError,
};

module.exports = {
  ...errorClasses,
  middleware(err, req, res, next) {
    if (err
        && Object.keys(errorClasses).includes(err.name)) {
      const logger = req.app.get('logger');
      logger.error('Error:', err);
      const { message, status } = err.getApiResponse();
      return res.status(status).json({
        errors: [{
          detail: message,
        }],
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({
        errors: [{
          detail: 'Unauthorized',
        }],
      });
    }

    return next(err);
  },
};
