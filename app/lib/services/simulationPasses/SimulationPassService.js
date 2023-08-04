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
        },
    },
} = require('../../database/DatabaseManager');
const { simulationPassAdapter } = require('../../database/adapters');
const { filterToSequelizeWhereClause } = require('../../server/utilities');

class SimulationPassesService {
    /**
     * Return all data passes,
     * @param {Object} query -  Filtering query definiton from http request
     * @returns {Promise<SimulationPass[]>} Promise object represents the result of this use case.
     */
    async getAll({ filter }) {
        const periods = await SimulationPassRepository.findAll({
            where: filterToSequelizeWhereClause(filter),
        });
        return periods.map((dataPass) => simulationPassAdapter.toEntity(dataPass));
    }

    /**
     * Return data passes belonging to period which id is provided
     * @param {Number} periodId - id of period which for runs should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<SimulationPass[]>} Promise object represents the result of this use case.
     */
    async getSimulationPassesPerPeriod(periodId, { filter }) {
        const runs = await SimulationPassRepository.findAll({
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
            where: {
                ...filterToSequelizeWhereClause(filter),
            },
        });
        return runs.map((dataPass) => simulationPassAdapter.toEntity(dataPass));
    }
}

module.exports = {
    simulationPassesService: new SimulationPassesService(),
};