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
    const Period = sequelize.define('Period', {
        name: {
            type: Sequelize.STRING,
            unique: true,
        },
        year: {
            type: Sequelize.INTEGER,
        },
    });

    Period.associate = (models) => {
        Period.hasMany(models.Run);
        Period.hasMany(models.DataPass);
        Period.belongsTo(models.BeamType, { foreginKey: 'beam_type_id' });
        Period.belongsToMany(models.SimulationPass, {
            through: 'anchored_periods',
            foreignKey: 'period_id',
            timestamps: false,
        });
    };

    return Period;
};
