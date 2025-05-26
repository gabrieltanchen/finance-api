import chai from 'chai';
import { LoginPasswordFailedError } from '../../../../app/middleware/error-handler/index.js';

const assert = chai.assert;

describe('Unit:Middleware - ErrorHandler - LoginPasswordFailedError', function() {
  it('should return invalid combination even for an unknown error', function() {
    const err = new LoginPasswordFailedError('Unknown error');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Invalid email/password combination.',
      status: 403,
    });
  });
});
