import Sequelize from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Fund', {
    balance_cents: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    household_uuid: {
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
    tableName: 'funds',
    timestamps: true,
  });
};
