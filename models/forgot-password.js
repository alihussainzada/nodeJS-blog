// models/ForgotPasswordToken.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/db_connection');

const ForgotPassword = sequelize.define('ForgotPassword', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true, // createdAt and updatedAt
  tableName: 'forgot_password_tokens', // optional custom table name
});

module.exports = ForgotPassword;
