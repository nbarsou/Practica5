'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Post extends Model {}
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Title cannot be empty',
          },
        },
      },
      body: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: {
            msg: 'Body cannot be empty',
          },
        },
      },
    },
    { sequelize, modelName: 'Posts' }
  );

  return Post;
};
