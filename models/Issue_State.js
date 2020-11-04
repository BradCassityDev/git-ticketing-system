const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Issue_State extends Model {}

Issue_State.init(
    {
    // Primary key
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'issue_state'
    }
);
  

module.exports = Issue_State;