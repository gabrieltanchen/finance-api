import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('incomes', 'employer_uuid', {
    allowNull: true,
    references: {
      key: 'uuid',
      model: 'employers',
    },
    type: Sequelize.UUID,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('incomes', 'employer_uuid');
}

export { up, down };
