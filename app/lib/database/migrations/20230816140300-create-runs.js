/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('runs', {
                run_number: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                },
                time_o2_start: {
                    type: Sequelize.DATE,
                },
                time_o2_end: {
                    type: Sequelize.DATE,
                },
                time_trg_start: {
                    type: Sequelize.DATE,
                },
                time_trg_end: {
                    type: Sequelize.DATE,
                },
                energy_per_beam: {
                    type: Sequelize.FLOAT,
                },
                l3_current: {
                    type: Sequelize.FLOAT,
                },
                dipole_current: {
                    type: Sequelize.FLOAT,
                },
                fill_number: {
                    type: Sequelize.INTEGER,
                },
                run_type: {
                    type: Sequelize.STRING,
                },
                period_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'periods',
                        key: 'id',
                    },
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
        )
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('runs');
    }
};
