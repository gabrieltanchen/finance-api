const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('budgets', {
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
    subcategory_uuid: {
      allowNull: false,
      references: {
        key: 'uuid',
        model: 'subcategories',
      },
      type: Sequelize.UUID,
    },
    year: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    month: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    budget_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('budgets');
}

module.exports = { up, down };
