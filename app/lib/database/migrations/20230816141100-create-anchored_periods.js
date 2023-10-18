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
        await queryInterface.createTable('anchored_periods', {
            period_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'periods',
                    key: 'id',
                },
            },
            sim_pass_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'simulation_passes',
                    key: 'id',
                },
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('anchored_periods');
    },
};
