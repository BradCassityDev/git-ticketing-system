const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Issue extends Model {}

Issue.init(
    {
    // Primary key
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      due_date: {
        type: DataTypes.STRING,
        allowNull: true
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      github_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isURL: true
        }
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'issue'
    }
);
  

module.exports = Issue;