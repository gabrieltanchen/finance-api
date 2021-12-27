const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('user_logins', {
    user_uuid: {
      allowNull: false,
      primaryKey: true,
      references: {
        key: 'uuid',
        model: 'users',
      },
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
    s1: {
      allowNull: false,
      type: Sequelize.STRING(64),
    },
    h2: {
      allowNull: false,
      type: Sequelize.STRING(128),
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('user_logins');
}

module.exports = { up, down };
