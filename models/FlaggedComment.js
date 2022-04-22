const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class FlaggedComment extends Model { }

FlaggedComment.init(
    {
        comment_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        flagger_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        onDelete: 'SET NULL',
    }
);

module.exports = FlaggedComment;