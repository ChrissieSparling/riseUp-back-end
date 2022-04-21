const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class FlaggedPost extends Model { }

FlaggedPost.init(
    {
        post_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        post_flagger_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        onDelete: 'SET NULL',
    }
);

module.exports = FlaggedPost;