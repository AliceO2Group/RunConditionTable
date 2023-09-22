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
        await queryInterface.createTable('quality_control_flags', {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                time_start: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                time_end: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                comment: {
                    type: Sequelize.TEXT,
                },
                added_by: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                run_number: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'runs',
                        key: 'run_number',
                    },
                },
                data_pass_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'data_passes',
                        key: 'id',
                    },
                },
                detector_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'detectors_subsystems',
                        key: 'id',
                    },
                },
                flag_type_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'flag_types_dictionary',
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
        await queryInterface.dropTable('quality_control_flags');
    }
};
