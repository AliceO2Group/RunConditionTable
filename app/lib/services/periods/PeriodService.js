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
        const baseClause = {
            include: [
                {
                    model: BeamType,
                    required: true,
                }, {
                    model: Run,
                    required: true,
                    attributes: [],
                },
            ],
            attributes: [
                'id',
                'name',
                'year',
                [
                    Sequelize.fn('avg',
                        Sequelize.fn('get_center_of_mass_energy', Sequelize.col('Runs.energy_per_beam'), Sequelize.col('BeamType.id'))),
                    'avgEnergy',
                ],
                [
                    Sequelize.fn('array_agg', Sequelize.fn('DISTINCT', Sequelize.col('Runs.energy_per_beam'))),
                    'distinctEnergies',
                ],
            ],
            group: ['Period.id', 'BeamType.id'],
            subQuery: false,
        };
        const { count, rows } = await PeriodRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));
        return {
            count,
            rows: rows.map((period) => periodAdapter.toEntity(period)),
        };
    }
}

module.exports = {
    periodService: new PeriodService(),
};
