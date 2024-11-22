import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('expenses', 'household_member_uuid', {
    allowNull: false,
    references: {
      key: 'uuid',
      model: 'household_members',
    },
    type: Sequelize.UUID,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('expenses', 'household_member_uuid');
}

export { up, down };
