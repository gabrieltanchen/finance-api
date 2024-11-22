import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('budgets', 'budget_cents', 'amount_cents');
}

async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('budgets', 'amount_cents', 'budget_cents');
}

export { up, down };
