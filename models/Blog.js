const { DataTypes } = require('sequelize');
const sequelize = require('../database/db_connection'); // adjust path if needed
const User = require('./User'); // assuming you have User model

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Foreign key for author
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING, // comma separated tags (or use separate model if you want)
    allowNull: true,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// Define association (if not already defined)
Blog.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = Blog;
