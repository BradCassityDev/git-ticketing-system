const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Ticket model
class Ticket extends Model { }


// define table columns and configuration
Ticket.init(
  {
    // Primary Key
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // this should be the github username eventually
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'ticket'
  }
);


module.exports = Ticket;  