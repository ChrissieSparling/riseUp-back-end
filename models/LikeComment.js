const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class LikeComment extends Model { }

LikeComment.init(
    {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        comment_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        onDelete: 'SET NULL',
    }
);

module.exports = LikeComment;