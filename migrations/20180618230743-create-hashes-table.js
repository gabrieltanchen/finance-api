const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('hashes', {
    h1: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING(128),
    },
    s2: {
      allowNull: false,
      type: Sequelize.STRING(64),
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('hashes');
}

module.exports = { up, down };
