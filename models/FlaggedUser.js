const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class FlaggedUser extends Model { }

FlaggedUser.init(
    {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        mod_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        onDelete: 'SET NULL',
    }
);

module.exports = FlaggedUser;