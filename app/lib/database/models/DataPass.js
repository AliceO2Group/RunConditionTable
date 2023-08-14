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
    const DataPass = sequelize.define('DataPass', {
        name: {
            type: Sequelize.STRING,
            unique: true,
        },
        description: {
            type: Sequelize.TEXT,
        },
        reconstructedEvents: {
            type: Sequelize.INTEGER,
            field: 'number_of_events',
        },
        outputSize: {
            type: Sequelize.REAL,
            field: 'size',
        },
        lastRun: {
            type: Sequelize.INTEGER,
        },
    }, { timestamps: false });
    DataPass.associate = (models) => {
        DataPass.belongsTo(models.Period);
        DataPass.belongsToMany(models.Run, {
            through: 'data_passes_runs',
            foreignKey: 'data_pass_id',
            timestamps: false,
        });
        DataPass.belongsToMany(models.SimulationPass, {
            through: 'anchored_passes',
            foreignKey: 'data_pass_id',
            timestamps: false,
        });
        DataPass.hasMany(models.QualityControlFlag, {foreignKey: 'data_pass_id'});
    };

    return DataPass;
};
