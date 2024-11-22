export class AttachmentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AttachmentError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'No open queries':
      return {
        message: 'Expense ID is required.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find attachment.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class AuditError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuditError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class BudgetError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BudgetError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Duplicate budget':
      return {
        message: 'A budget already exists for that month.',
        status: 403,
      };
    case 'Invalid month':
      return {
        message: 'Invalid month provided.',
        status: 403,
      };
    case 'Invalid notes':
      return {
        message: 'Invalid notes provided.',
        status: 403,
      };
    case 'Invalid year':
      return {
        message: 'Invalid year provided.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find budget.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class CategoryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CategoryError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Cannot delete with budgets':
      return {
        message: 'Cannot delete when there are budgets remaining.',
        status: 422,
      };
    case 'Cannot delete with expenses':
      return {
        message: 'Cannot delete when there are expenses remaining.',
        status: 422,
      };
    case 'Cannot delete with subcategories':
      return {
        message: 'Cannot delete when there are subcategories remaining.',
        status: 422,
      };
    case 'Invalid year':
      return {
        message: 'Invalid ID provided.',
        status: 403,
      };
    case 'No open queries':
      return {
        message: 'Category ID is required.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find category.',
        status: 404,
      };
    case 'Parent category not found':
      return {
        message: 'Could not find parent category.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class EmployerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmployerError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Not found':
      return {
        message: 'Unable to find employer.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class ExpenseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ExpenseError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'No open queries':
      return {
        message: 'Subcategory or vendor ID is required.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find expense.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class FundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FundError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Deposit not found':
      return {
        message: 'Unable to find deposit.',
        status: 404,
      };
    case 'No open deposit queries':
      return {
        message: 'Fund ID is required.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find fund.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class HouseholdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HouseholdError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Cannot delete with expenses':
      return {
        message: 'Cannot delete when there are expenses remaining.',
        status: 422,
      };
    case 'Not found':
      return {
        message: 'Unable to find member.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class IncomeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IncomeError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Not found':
      return {
        message: 'Unable to find income.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class LoanError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoanError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Not found':
      return {
        message: 'Unable to find loan.',
        status: 404,
      };
    case 'Loan payment not found':
      return {
        message: 'Unable to find loan payment.',
        status: 404,
      };
    case 'No open loan payment queries':
      return {
        message: 'Loan ID is required.',
        status: 403,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class LoginPasswordFailedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoginPasswordFailedError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    default:
      return {
        message: 'Invalid email/password combination.',
        status: 403,
      };
    }
  }
};

export class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Email already exists':
      return {
        message: 'That email address is already taken.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find user.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};

export class VendorError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VendorError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Cannot delete with expenses':
      return {
        message: 'Cannot delete when there are expenses remaining.',
        status: 422,
      };
    case 'Not found':
      return {
        message: 'Unable to find vendor.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};


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


export function middleware(err, req, res, next) {
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
}
