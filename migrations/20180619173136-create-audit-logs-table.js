const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('audit_logs', {
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
    audit_api_call_uuid: {
      allowNull: true,
      references: {
        key: 'uuid',
        model: 'audit_api_calls',
      },
      type: Sequelize.UUID,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('audit_logs');
}

module.exports = { up, down };
