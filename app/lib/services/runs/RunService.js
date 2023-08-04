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
            RunRepository,
        },
        models: {
            DataPass,
        },
    },
} = require('../../database/DatabaseManager');
const { runAdapter } = require('../../database/adapters');
const { filterToSequelizeWhereClause } = require('../../server/utilities');

class RunService {
    /**
     * Return all runs
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<Run[]>} Promise object represents the result of this use case.
     */
    async getAll({ filter }) {
        const runs = await RunRepository.findAllWithDetectors({
            where: filterToSequelizeWhereClause(filter),
        });
        return runs.map((run) => runAdapter.toEntity(run));
    }

    /**
     * Return all runs belonging to one period
     * @param {Number} periodId - id of period which for runs should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<Run[]>} Promise object represents the result of this use case.
     */
    async getRunsPerPeriod(periodId, { filter }) {
        const runs = await RunRepository.findAllWithDetectors({
            where: {
                period_id: periodId,
                ...filterToSequelizeWhereClause(filter),
            },
        });
        return runs.map((run) => runAdapter.toEntity(run));
    }

    /**
     * Return all runs belonging to one data pass
     * @param {Number} dataPassId - id of data pass which for runs should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<Run[]>} Promise object represents the result of this use case.
     */
    async getRunsPerDataPass(dataPassId, { filter }) {
        const runs = await RunRepository.findAllWithDetectors({
            include: [
                {
                    model: DataPass,
                    required: true,
                    attributes: [],
                    through: {
                        where: {
                            data_pass_id: dataPassId,
                        },
                    },
                },
            ],
            where: {
                ...filterToSequelizeWhereClause(filter),
            },
        });
        return runs.map((run) => runAdapter.toEntity(run));
    }
}

module.exports = {
    runService: new RunService(),
};
