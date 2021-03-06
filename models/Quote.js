const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Quote extends Model {}

Quote.init(
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
        body: {
          type: DataTypes.TEXT,
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
        modelName: "quote"
    
      }
    );
    
module.exports = Quote;