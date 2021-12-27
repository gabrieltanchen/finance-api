const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('audit_changes', {
    uuid: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    audit_log_uuid: {
      allowNull: false,
      references: {
        key: 'uuid',
        model: 'audit_logs',
      },
      type: Sequelize.UUID,
    },
    table: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    key: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    attribute: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    old_value: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    new_value: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('audit_changes');
}

module.exports = { up, down };
