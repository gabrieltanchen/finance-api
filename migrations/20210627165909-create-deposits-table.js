import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('deposits', {
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
    fund_uuid: {
      allowNull: false,
      references: {
        key: 'uuid',
        model: 'funds',
      },
      type: Sequelize.UUID,
    },
    date: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    amount_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('deposits');
}

export { up, down };
