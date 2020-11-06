const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User_State extends Model { }

User_State.init(
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
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_state'
  }
);


module.exports = User_State;