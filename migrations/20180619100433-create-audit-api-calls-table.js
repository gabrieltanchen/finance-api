const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('audit_api_calls', {
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    user_uuid: {
      allowNull: true,
      references: {
        key: 'uuid',
        model: 'users',
      },
      type: Sequelize.UUID,
    },
    user_agent: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    ip_address: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    http_method: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    route: {
      allowNull: true,
      type: Sequelize.STRING,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('audit_api_calls');
}

module.exports = { up, down };
