const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Relationship extends Model { }

Relationship.init(
    {
        follower_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        followed_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        onDelete: 'SET NULL',
    }
);

module.exports = Relationship;