import chai from 'chai';
import chaiHttp from 'chai-http';
import TestHelper from '../../../test-helper/index.js';

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /users/login', function() {
  let server;
  const testHelper = new TestHelper();

  before('get server', async function() {
    this.timeout(30000);
    server = await testHelper.getServer();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 401', async function() {
    const res = await chai.request(server)
      .patch('/users/login')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });
});
