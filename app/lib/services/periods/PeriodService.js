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

const {
    databaseManager: {
        repositories: {
            PeriodRepository,
        },
        models: {
            BeamType,
            Run,
            DataPass,
            SimulationPass,
        },
    },
} = require('../../database/DatabaseManager');
const { periodAdapter } = require('../../database/adapters');
const { QueryBuilder } = require('../../database/utilities');

class PeriodService {
    /**
     * Return all periods
     * @param {Object} query -  Filtering query definiton from http request,... #TODO
     * @returns {Promise<Period[]>} Promise object represents the result of this use case.
     */
    async getAll(query) {
        const additionalFields = [
            [
                Sequelize.fn('avg',
                    Sequelize.fn('get_center_of_mass_energy', Sequelize.col('Runs.energy_per_beam'), Sequelize.col('BeamType.id'))),
                'avgEnergy',
            ],
            [
                Sequelize.fn('array_agg', Sequelize.fn('DISTINCT', Sequelize.col('Runs.energy_per_beam'))),
                'distinctEnergies',
            ],
            [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('Runs.run_number'))), 'runsCount'],
            [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('DataPasses.id'))), 'dataPassesCount'],
            [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('SimulationPasses.id'))), 'simulationPassesCount'],
        ];

        const baseClause = {
            include: [
                {
                    model: BeamType,
                    required: true,
                },
                {
                    model: Run,
                    required: false,
                    attributes: [],
                },
                {
                    model: DataPass,
                    required: false,
                    attributes: [],
                },
                {
                    model: SimulationPass,
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

            group: [
                'Period.id',
                'BeamType.id',
            ],
            subQuery: false,
        };

        const { count, rows } = await PeriodRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));
        return {
            count: count.length,
            rows: rows.map((period) => periodAdapter.toEntity(period)),
        };
    }
}

module.exports = {
    periodService: new PeriodService(),
};
