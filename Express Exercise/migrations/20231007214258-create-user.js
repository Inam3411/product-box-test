'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false // Added not nullable constraint to name
      },
      otp: {
        type: Sequelize.STRING
      },
      otp_expiration_date: {
        type: Sequelize.DATE
      },
      phone_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false // Added not nullable constraint to phone_number
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
