const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('budgets', 'notes', {
    allowNull: false,
    defaultValue: '',
    type: Sequelize.TEXT,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('budgets', 'notes');
}

module.exports = { up, down } ;
