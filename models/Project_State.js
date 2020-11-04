const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Project_State extends Model {}

Project_State.init(
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
      modelName: 'project_state'
    }
);
  

module.exports = Project_State;