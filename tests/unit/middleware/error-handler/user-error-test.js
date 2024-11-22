import chai from 'chai';

const assert = chai.assert;

import { UserError } from '../../../../app/middleware/error-handler/index.js';

describe('Unit:Middleware - ErrorHandler - UserError', function() {
  it('should return not found message', function() {
    const err = new UserError('Not found');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Unable to find user.',
      status: 404,
    });
  });

  it('should return 500 with unknown error', function() {
    const err = new UserError('Unknown error');
    assert.deepEqual(err.getApiResponse(), {
      message: 'An error occurred. Please try again later.',
      status: 500,
    });
  });
});
