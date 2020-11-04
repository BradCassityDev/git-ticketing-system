const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Issue_user extends Model {}

Issue_user.init(
    {
    // Primary key
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'issue_user'
    }
);
  

module.exports = Issue_user;