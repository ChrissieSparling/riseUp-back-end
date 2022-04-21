const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Comment extends Model {}

Comment.init(
  {
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
        type: DataTypes.DATEONLY,
        defaultValue: Sequelize.NOW()
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    flagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      // CHANGED THE UUID TO INTEGER FOR NOW
      // allowNull: false
    }
  },
  {
    sequelize
  }
);

module.exports = Comment;
