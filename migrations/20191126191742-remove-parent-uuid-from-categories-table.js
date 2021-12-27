const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.removeColumn('categories', 'parent_uuid');
}

async function down({ context: queryInterface }) {
  await queryInterface.addColumn('categories', 'parent_uuid', {
    allowNull: true,
    references: {
      key: 'uuid',
      model: 'categories',
    },
    type: Sequelize.UUID,
  });
}

module.exports = { up, down };
