const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Post = require('./Post');

class LikePost extends Model { }

LikePost.init(
    {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        post_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        onDelete: 'SET NULL',
    }
);

module.exports = LikePost;