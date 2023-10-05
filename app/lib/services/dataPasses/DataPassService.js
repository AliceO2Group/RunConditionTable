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

const { Sequelize } = require('sequelize');
const {
    databaseManager: {
        repositories: {
            DataPassRepository,
        },
        models: {
            Run,
            SimulationPass,
        },
    },
} = require('../../database/DatabaseManager');
const { dataPassAdapter } = require('../../database/adapters');
const { QueryBuilder } = require('../../database/utilities');
const { deepmerge } = require('../../utils');

const additionalFields = [
    [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('Runs.run_number'))), 'runsCount'],
    [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('SimulationPasses.id'))), 'simulationPassesCount'],
];
const commonGroupClause = ['DataPass.id'];

const commonClause = {
    include: [
        {
            model: Run,
            require: false,
            attributes: [],
            through: {
                attributes: [],
            },
        },
        {
            model: SimulationPass,
            require: false,
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

class DataPassService {
    /**
     * Return all data passes,
     * @param {Object} query -  Filtering query definiton from http request
     * @returns {Promise<DataPass[]>} Promise object represents the result of this use case.
     */
    async getAll(query) {
        const baseClause = commonClause;

        const { count, rows } = await DataPassRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));

        return {
            count: count.length,
            rows: rows.map((dataPass) => dataPassAdapter.toEntity(dataPass)),
        };
    }

    /**
     * Return data passes belonging to period which id is provided
     * @param {Number} periodId - id of period which for runs should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<DataPass[]>} Promise object represents the result of this use case.
     */
    async getDataPassesPerPeriod(periodId, query) {
        const baseClause = deepmerge(commonClause, {
            where: {
                period_id: periodId,
            },
        });

        const { count, rows } = await DataPassRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));
        return {
            count: count.length,
            rows: rows.map((dataPass) => dataPassAdapter.toEntity(dataPass)),
        };
    }

    /**
     * Return data passes which to period which id is provided
     * @param {Number} simulationPassId - id of simulaton pass which for runs should be returnd
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<DataPass[]>} Promise object represents the result of this use case.
     */
    async getAnchoredToSimulationPass(simulationPassId, query) {
        const baseClause = {
            ...commonClause,
            ...{
                include: [
                    {
                        model: Run,
                        require: false,
                        attributes: [],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: SimulationPass,
                        require: false,
                        attributes: [],
                        where: {
                            id: simulationPassId,
                        },
                        through: {
                            attributes: [],
                        },
                    },
                ],
            },
        };

        const { count, rows } = await DataPassRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));
        return {
            count: count.length,
            rows: rows.map((dataPass) => dataPassAdapter.toEntity(dataPass)),
        };
    }
}

module.exports = {
    dataPassService: new DataPassService(),
};
