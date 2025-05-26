import chai from 'chai';
import { ExpenseError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Middleware - ErrorHandler - ExpenseError', function() {
  it('should return no open queries message', function() {
    const err = new ExpenseError('No open queries');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Subcategory or vendor ID is required.',
      status: 403,
    });
  });

  it('should return not found message', function() {
    const err = new ExpenseError('Not found');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Unable to find expense.',
      status: 404,
    });
  });

  it('should return 500 with unknown error', function() {
    const err = new ExpenseError('Unknown error');
    assert.deepEqual(err.getApiResponse(), {
      message: 'An error occurred. Please try again later.',
      status: 500,
    });
  });
});
