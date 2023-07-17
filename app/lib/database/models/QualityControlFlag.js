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
    const QualityControlFlag = sequelize.define('QualityControlFlag', {
        timeStart: {
            type: Sequelize.DATE,
            allowNull: false
        },
        timeEnd: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        comment: {
            type: Sequelize.TEXT,
        },
        addedBy: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    })

    QualityControlFlag.associate = (models) => {
        QualityControlFlag.belongsTo(models.DataPass);
        QualityControlFlag.belongsTo(models.Run);
        QualityControlFlag.belongsTo(models.FlagType);
        QualityControlFlag.hasMany(models.Verification);
        QualityControlFlag.belongsTo(models.DetectorSubsystem);
    }

    return QualityControlFlag;
};