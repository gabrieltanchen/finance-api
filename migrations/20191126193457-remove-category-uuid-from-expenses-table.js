import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.removeColumn('expenses', 'category_uuid');
}

async function down({ context: queryInterface }) {
  await queryInterface.addColumn('expenses', 'category_uuid', {
    allowNull: true,
    references: {
      key: 'uuid',
      model: 'categories',
    },
    type: Sequelize.UUID,
  });
}

export { up, down };
