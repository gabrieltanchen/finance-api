const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('loans', {
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
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    household_uuid: {
      allowNull: false,
      references: {
        key: 'uuid',
        model: 'households',
      },
      type: Sequelize.UUID,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    amount_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    balance_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    archived_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('loans');
}

module.exports = { up, down };
