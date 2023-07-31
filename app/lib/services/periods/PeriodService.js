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
            PeriodRepository,
        },
    },
} = require('../../database/DatabaseManager');
const { periodAdapter } = require('../../database/adapters');

class PeriodService {
    /**
     * Return all periods
     * @param {Object} query -  Filtering query definiton from http request,... #TODO
     * @returns {Promise<Run[]>} Promise object represents the result of this use case.
     */
    async getAll(query) { // TODO args
        const periods = await PeriodRepository.findAll(query);
        return periods.map((period) => periodAdapter.toEntity(period));
    }
}

module.exports = {
    periodService: new PeriodService(),
};
