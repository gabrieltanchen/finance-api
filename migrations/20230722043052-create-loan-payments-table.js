import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('loan_payments', {
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
    loan_uuid: {
      allowNull: false,
      references: {
        key: 'uuid',
        model: 'loans',
      },
      type: Sequelize.UUID,
    },
    date: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    principal_amount_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    interest_amount_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  });
};

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('loan_payments');
}

export { up, down };
