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
    const FlagType = sequelize.define('FlagType', {
        name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        method: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        bad: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        obsolate: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
    }, { timestamps: false, tableName: 'flag_types_dictionary' });

    FlagType.associate = (models) => {
        FlagType.hasMany(models.QualityControlFlag, { foreignKey: 'flag_type_id' });
    };

    return FlagType;
};
