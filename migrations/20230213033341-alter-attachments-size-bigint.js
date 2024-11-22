import { Sequelize } from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.changeColumn('attachments', 'aws_content_length', {
    type: Sequelize.BIGINT,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.changeColumn('attachments', 'aws_content_length', {
    type: Sequelize.INTEGER,
  });
}

export { up, down };
