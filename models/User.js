const sequelize = require('../database/db_connection')
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
   lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
      type: DataTypes.STRING, // store just the filename or full path
      allowNull: true,
      defaultValue: '/static/images/default-avatar.png' // can be empty for new users
    }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = User;
