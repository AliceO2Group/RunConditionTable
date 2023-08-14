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
    const MetaData = sequelize.define('MetaData', {
        name: {
            primaryKey: true,
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        val: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },

    }, { timestamps: true, tableName: 'meta' });

    MetaData.associate = () => {};

    return MetaData;
};
