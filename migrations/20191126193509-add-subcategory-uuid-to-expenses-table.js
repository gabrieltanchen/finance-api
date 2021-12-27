const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('expenses', 'subcategory_uuid', {
    allowNull: false,
    references: {
      key: 'uuid',
      model: 'subcategories',
    },
    type: Sequelize.UUID,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('expenses', 'subcategory_uuid');
}

module.exports = { up, down };
