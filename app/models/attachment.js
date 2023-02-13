const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Attachment', {
    aws_bucket: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    aws_content_length: {
      allowNull: true,
      type: Sequelize.BIGINT,
    },
    aws_content_type: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    aws_etag: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    aws_key: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    created_at: {
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
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    uuid: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
    },
  }, {
    paranoid: true,
    tableName: 'attachments',
    timestamps: true,
  });
};
