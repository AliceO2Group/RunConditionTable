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
        await queryInterface.createTable('simulation_passes_runs', {
            run_number: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'runs',
                    key: 'run_number',
                },
            },
            simulation_pass_id: {
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
        await queryInterface.dropTable('simulation_passes_runs');
    },
};
