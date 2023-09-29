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
            Run,
            DataPass,
        },
    },
} = require('../../database/DatabaseManager');
const { simulationPassAdapter } = require('../../database/adapters');
const { QueryBuilder } = require('../../database/utilities');

const { Sequelize } = require('sequelize');
const { deepmerge } = require('../../utils');

const additionalFields = [
    [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('Runs.run_number'))), 'runsCount'],
    [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('DataPasses.id'))), 'dataPassesCount'],
];

const commonGroupClause = ['SimulationPass.id'];

const commonClause = {
    include: [
        {
            model: Run,
            required: false,
            attributes: [],
            through: {
                attributes: [],
            },
        },
        {
            model: DataPass,
            required: false,
            attributes: [],
            through: {
                attributes: [],
            },
        },
    ],

    attributes: {
        include: additionalFields,
    },

    group: commonGroupClause,
    subQuery: false,
};

class SimulationPassService {
    /**
     * Return all simulation passes,
     * @param {Object} query -  Filtering query definiton from http request
     * @returns {Promise<SimulationPass[]>} Promise object represents the result of this use case.
     */
    async getAll(query) {
        const baseClause = commonClause;
        const { count, rows } = await SimulationPassRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));
        return {
            count: count.length,
            rows: rows.map((simulationPass) => simulationPassAdapter.toEntity(simulationPass)),
        };
    }

    /**
     * Return simulation passes belonging to period which id is provided
     * @param {Number} periodId - id of period which for simulation passes should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<SimulationPass[]>} Promise object represents the result of this use case.
     */
    async getSimulationPassesPerPeriod(periodId, query) {
        const baseClause = deepmerge(commonClause,
            {
                include: [
                    {
                        model: Period,
                        required: true,
                        attributes: [],
                        where: {
                            id: periodId,
                        },
                        through: {
                            attributes: [],
                        },
                    },
                ],
            });

        const { count, rows } = await SimulationPassRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));
        return { count, rows: rows.map((simulationPass) => simulationPassAdapter.toEntity(simulationPass)) };
    }

    /**
     * Return simulation passes which are anchored to data pass which id is provided
     * @param {Number} dataPassId - id of data pass which for simulation passes should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<SimulationPass[]>} Promise object represents the result of this use case.
     */
    async getAnchorageForDataPass(dataPassId, query) {
        const baseClause = {
            ...commonClause,
            ...{
                include: [
                    {
                        model: Run,
                        required: false,
                        attributes: [],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: DataPass,
                        required: true,
                        attributes: [],
                        where: {
                            id: dataPassId,
                        },
                        through: {
                            attributes: [],
                        },
                    },
                ] },
        };

        const { count, rows } = await SimulationPassRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));
        return {
            count: count.length,
            rows: rows.map((simulationPass) => simulationPassAdapter.toEntity(simulationPass)),
        };
    }
}

module.exports = {
    simulationPassService: new SimulationPassService(),
};
