const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Inspiration extends Model {}

Inspiration.init(
    {
        userId: {
          type: DataTypes.INTEGER,
          references: {
              model: "user",
              key: "id",
          },
          // allowNull:false
        },
       topic: {
          type: DataTypes.STRING,
          allowNull:false
        },
        authorName: {
            type: DataTypes.STRING,
            allowNull:false
          },
          image:{
            type: DataTypes.STRING,
            allownull: false,
          },
        body: {
          type: DataTypes.STRING,
          allowNull:false
        },
        likeCount: {
          type: DataTypes.INTEGER,
        },
        createdAt: {
          type: DataTypes.DATEONLY,
          allowNull:false,
          default: Sequelize.NOW()
        }
      },
      {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        underscored: true,
        modelName: "inspiration"
    
      }
    );

module.exports = Inspiration;