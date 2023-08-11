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
            QualityControlFlagRepository,
        },
        models: {
            DeteectorSubsystem,
            FlagType,
            QualityControlFlagVerification,
        },
    },
} = require('../../database/DatabaseManager');
const { qualityControlFlagAdapter } = require('../../database/adapters');
const { filterToSequelizeWhereClause } = require('../../server/utilities');

class QualityControlService {
    /**
     * Return all runs
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<Quality[]>} Promise object represents the result of this use case.
     */
    async getAllTimeBasedFlags({ filter }) {
        const qualityFlags = await QualityControlFlagRepository.findAll({
            include: [
                {
                    model: DeteectorSubsystem,
                    required: true,
                    attribute: ['name'],
                },
                {
                    model: FlagType,
                    required: true,
                },
                {
                    model: FlagType,
                    required: true,
                },
                {
                    model: QualityControlFlagVerification,
                    required: false,
                },
            ],
            where: filterToSequelizeWhereClause(filter),
        });
        return qualityFlags.map((qualityFlags) => qualityControlFlagAdapter.toEntity(qualityFlags));
    }
}

module.exports = {
    qualityControlService: new QualityControlService(),
};
