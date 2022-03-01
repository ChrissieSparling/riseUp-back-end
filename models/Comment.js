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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      // allowNull: false
    }
  },
  {
    sequelize
  }
);

module.exports = Comment;
