'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'Posts',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          validate: { notEmpty: { msg: 'Title cannot be empty' } },
        },
        body: {
          type: Sequelize.TEXT,
          validate: { notEmpty: { msg: 'Title cannot be empty' } },
        },
      },
      {
        sync: { force: true },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  },
};
