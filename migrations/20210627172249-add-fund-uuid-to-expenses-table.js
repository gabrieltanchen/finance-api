const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('expenses', 'fund_uuid', {
    allowNull: true,
    references: {
      key: 'uuid',
      model: 'funds',
    },
    type: Sequelize.UUID,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('expenses', 'fund_uuid');
}

module.exports = { up, down };
