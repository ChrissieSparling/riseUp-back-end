const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Affirmation extends Model {}

Affirmation.init(
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
          type: DataTypes.STRING,
          allowNull:false
        },
        image:{
          type: DataTypes.STRING,
          allownull: false,
        },
        createdAt: {
          type: DataTypes.DATEONLY,
          allowNull:true,
          default: Sequelize.NOW()
        }
      },
      {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        underscored: true,
        modelName: "affirmation"
    
      }
    );
    

module.exports = Affirmation;