const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Ticket_State model
class Ticket_State extends Model { }


// define table columns and configuration
Ticket_State.init(
  {
    // Primary Key
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
    modelName: 'ticket_state'
  }
);


module.exports = Ticket_State;  