import { Sequelize } from 'sequelize';

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

export { up, down };
