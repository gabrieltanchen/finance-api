import chai from 'chai';
import chaiHttp from 'chai-http';
import { v4 as uuidv4 } from 'uuid';

import TestHelper from '../../../../test-helper/index.js';

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /attachments/:uuid/upload', function() {
  let server;
  const testHelper = new TestHelper();

  before('get server', async function() {
    this.timeout(30000);
    server = await testHelper.getServer();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 501', async function() {
    const res = await chai.request(server)
      .get(`/attachments/${uuidv4()}/upload`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(501);
    assert.deepEqual(res.body, {});
  });
});
