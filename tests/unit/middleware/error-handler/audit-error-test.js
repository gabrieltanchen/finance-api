import chai from 'chai';
import { AuditError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Middleware - ErrorHandler - AuditError', function() {
  it('should return 500 with unknown error', function() {
    const err = new AuditError('Unknown error');
    assert.deepEqual(err.getApiResponse(), {
      message: 'An error occurred. Please try again later.',
      status: 500,
    });
  });
});
