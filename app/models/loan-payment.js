const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('LoanPayment', {
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    date: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    interest_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    loan_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    principal_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
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
    tableName: 'loan_payments',
    timestamps: true,
  });
};
