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

const {
    databaseManager: {
        repositories: {
            DataPassRepository,
        },
    },
} = require('../../database/DatabaseManager');
const { dataPassAdapter } = require('../../database/adapters');
const { filterToSequelizeWhereClause } = require('../../server/utilities');

class DataPassService {
    /**
     * Return all data passes,
     * @param {Object} query -  Filtering query definiton from http request
     * @returns {Promise<Period[]>} Promise object represents the result of this use case.
     */
    async getAll({ filter }) {
        const periods = await DataPassRepository.findAll({
            where: filterToSequelizeWhereClause(filter),
        });
        return periods.map((dataPass) => dataPassAdapter.toEntity(dataPass));
    }
}

module.exports = {
    dataPassService: new DataPassService(),
};
