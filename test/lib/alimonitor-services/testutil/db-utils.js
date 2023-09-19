/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const { databaseManager: {
    sequelize,
} } = require('../../../../app/lib/database/DatabaseManager.js');

const truncateDatabase = async () => {
    await sequelize.getQueryInterface().bulkDelete('periods', {}, { truncate: true, cascade: true });
    await sequelize.getQueryInterface().bulkDelete('simulation_passes', {}, { truncate: true, cascade: true });
};

module.exports = {
    truncateDatabase,
};
