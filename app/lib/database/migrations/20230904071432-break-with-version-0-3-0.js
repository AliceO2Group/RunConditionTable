'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    if (process.env.npm_package_version === '0.3.0') {
      await queryInterface.bulkDelete('periods', {}, {truncate: true, cascade: true});
    }
  },


  async down (queryInterface, Sequelize) { }
};
