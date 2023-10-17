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

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SimulationPass = sequelize.define('SimulationPass', {
        name: {
            type: Sequelize.STRING,
            unique: true,
        },
        description: {
            type: Sequelize.TEXT,
        },
        jiraId: {
            type: Sequelize.STRING,
            field: 'jira',
        },
        PWG: {
            type: Sequelize.TEXT,
            field: 'pwg',
        },
        requestedEvents: {
            type: Sequelize.INTEGER,
            field: 'number_of_events',
        },
        outputSize: {
            type: Sequelize.REAL,
            field: 'size',
        },
    });

    SimulationPass.associate = (models) => {
        SimulationPass.belongsToMany(models.Period, {
            through: 'anchored_periods',
            foreignKey: 'sim_pass_id',
            timestamps: false,
        });
        SimulationPass.belongsToMany(models.DataPass, {
            through: 'anchored_passes',
            foreignKey: 'sim_pass_id',
            timestamps: false,
        });
        SimulationPass.belongsToMany(models.Run, {
            through: 'simulation_passes_runs',
            foreignKey: 'simulation_pass_id',
            timestamps: false,
        });
    };

    return SimulationPass;
};
