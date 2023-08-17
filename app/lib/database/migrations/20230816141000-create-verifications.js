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
        await queryInterface.createTable('verifications', {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                verified_by: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                verification_time: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                qcf_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'quality_control_flags',
                        key: 'id',
                    },
                },
            },
        )
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('verifications');
    }
};
