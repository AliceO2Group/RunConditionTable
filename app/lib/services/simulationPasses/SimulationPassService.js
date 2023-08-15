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
            SimulationPassRepository,
        },
        models: {
            Period,
            DataPass,
        },
    },
} = require('../../database/DatabaseManager');
const { simulationPassAdapter } = require('../../database/adapters');
const { QueryBuilder } = require('../../database/utilities');
const { filterToSequelizeWhereClause } = require('../../server/utilities');

class SimulationPassService {
    /**
     * Return all simulation passes,
     * @param {Object} query -  Filtering query definiton from http request
     * @returns {Promise<SimulationPass[]>} Promise object represents the result of this use case.
     */
    async getAll(query) {
        const periods = await SimulationPassRepository.findAll(new QueryBuilder().addFromHttpRequest(query));
        return periods.map((dataPass) => simulationPassAdapter.toEntity(dataPass));
    }

    /**
     * Return simulation passes belonging to period which id is provided
     * @param {Number} periodId - id of period which for simulation passes should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<SimulationPass[]>} Promise object represents the result of this use case.
     */
    async getSimulationPassesPerPeriod(periodId, query) {
        const baseClause = {
            include: [
                {
                    model: Period,
                    required: true,
                    attributes: [],
                    through: {
                        where: {
                            period_id: periodId,
                        },
                    },
                },
            ],
        };

        const runs = await SimulationPassRepository.findAll(new QueryBuilder(baseClause).addFromHttpRequest(query));
        return runs.map((dataPass) => simulationPassAdapter.toEntity(dataPass));
    }

    /**
     * Return simulation passes which are anchored to data pass which id is provided
     * @param {Number} dataPassId - id of data pass which for simulation passes should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<SimulationPass[]>} Promise object represents the result of this use case.
     */
    async getAnchorageForDataPass(dataPassId, query) {
        const baseClause = {
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
        };

        const runs = await SimulationPassRepository.findAll(new QueryBuilder(baseClause).addFromHttpRequest(query));
        return runs.map((dataPass) => simulationPassAdapter.toEntity(dataPass));
    }
}

module.exports = {
    simulationPassService: new SimulationPassService(),
};
