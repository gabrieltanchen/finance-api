const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('attachments', {
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
    entity_type: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    entity_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    aws_bucket: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    aws_key: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    aws_content_length: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    aws_content_type: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    aws_etag: {
      allowNull: true,
      type: Sequelize.STRING,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('attachments');
}

module.exports = { up, down };
