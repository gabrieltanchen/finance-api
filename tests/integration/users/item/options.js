const chai = require('chai');
const chaiHttp = require('chai-http');
const TestHelper = require('../../../test-helper/');
const uuidv4 = require('uuid/v4');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - OPTIONS /users/:userUuid', function() {
  let server;
  const testHelper = new TestHelper();

  before(async function() {
    this.timeout(30000);
    server = await testHelper.getServer();
  });

  after(async function() {
    await testHelper.cleanup();
  });

  it('should return 200', async function() {
    const res = await chai.request(server)
      .options(`/users/${uuidv4()}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(200);
    assert.deepEqual(res.body, {});
  });
});
