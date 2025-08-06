const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('modern', 'ali', 'ALIali110@', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = sequelize;
