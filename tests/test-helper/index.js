require('../../config');
const App = require('../../app');

class TestHelper {
  async cleanup() {
    /* istanbul ignore if */
    if (!this.app || !this.server) {
      throw new Error('App not yet initialized.');
    }
    const models = this.app.get('models');
    await models.sequelize.connectionManager.close();
    await this.server.close();
  }

  constructor() {
    this.app = null;
    this.server = null;
  }

  async getApp() {
    if (!this.app) {
      await this.setup();
    }
    return this.app;
  }

  async getServer() {
    if (!this.server) {
      await this.setup();
    }
    return this.server;
  }

  async setup() {
    const app = new App({
      logger: {
        error: () => {},
        info: () => {},
      },
    });
    this.app = app.app;
    this.server = await app.startServer();
  }

  async truncateTables() {
    const models = this.app.get('models');
    await models.Audit.Change.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Audit.Log.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Audit.ApiCall.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Expense.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Vendor.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.HouseholdMember.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Subcategory.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Category.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.UserLogin.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Loan.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.User.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Household.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
    await models.Hash.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
  }
}

module.exports = TestHelper;
