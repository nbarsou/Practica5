'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Posts', [
      {
        title: 'Primer Post',
        body: 'Esta práctica implementa un Blog.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Segundo Post',
        body: 'Todo el mundo puede crear posts.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Tercer Post',
        body: 'Cada post puede tener una imagen adjunta.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Cuarto Post',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Posts', null, {});
  },
};
