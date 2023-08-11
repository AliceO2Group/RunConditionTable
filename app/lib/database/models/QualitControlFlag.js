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
        },
        timeEnd: {
            type: Sequelize.DATE,
        },
        comment: {
            type: Sequelize.TEXT,
        },
        addedBy: {
            type: Sequelize.STRING
        },
    }, { 
        timestamps: true, 
        createdAt: 'addition_time', 
        updatedAt: 'last_modification_time',
    });
    
    QualityControlFlag.associate = (models) => { 
        QualityControlFlag.belongsTo(models.Run);
        QualityControlFlag.belongsTo(models.DataPass);
        QualityControlFlag.belongsTo(models.DetectorSubsystem);
        // QualityControlFlag.belongsTo(models.FlagTypesDictionary);
        // QualityControlFlag.hasMany(models.QualityControlFlagVerification);

    };

    return QualityControlFlag;
};
