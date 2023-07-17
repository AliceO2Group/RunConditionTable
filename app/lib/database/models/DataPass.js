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
            type: Sequelize.TEXT, // fNlikeInSrc
        },
        reconstructedEvents: {
            type: Sequelize.INTEGER,
        },
        outputSize: {
            type: Sequelize.REAL,
        },
        lastRun: {
            type: Sequelize.INTEGER,
        },

        // TODO
        // - jira, ml, soft_version


    });
    DataPass.associate = (models) => {
        DataPass.belongsTo(models.Period);
        DataPass.belongsToMany(models.Run, {
            through: 'DataPass_Runs',
        });
        DataPass.belongsToMany(models.SimulationPass, {
            through: 'AnchoredPasses',
        });
        DataPass.hasMany(models.QualityControlFlag);
    };

    return DataPass;
};
