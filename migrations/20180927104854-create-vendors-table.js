const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('vendors', {
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
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('vendors');
}

module.exports = { up, down };
