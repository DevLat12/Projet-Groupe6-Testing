'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('vehicles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            registrationNumber: {
                type: Sequelize.STRING
            },
            mark: {
                type: Sequelize.STRING, allowNull: true

            },
            modele: {
                type: Sequelize.STRING
            },
            annee: {
                type: Sequelize.INTEGER
            },
            rentalPrice: {
                type: Sequelize.DOUBLE,
                allowNull: false
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
        await queryInterface.dropTable('vehicles');
    }
};