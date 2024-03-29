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
            QualityControlFlagVerificationRepository,
        },
        models: {
            DetectorSubsystem,
            FlagType,
            QualityControlFlagVerification,
        },
    },
} = require('../../database/DatabaseManager');
const { qualityControlFlagAdapter } = require('../../database/adapters');
const { QueryBuilder } = require('../../database/utilities');

class QualityControlService {
    /**
     * Return All time based qualities / flags in db including their verification
     * @param {Object} query - Filtering query definiton from http request,... #TODO
     * @returns {Promise<Quality[]>} Promise object represents the result of this use case.
     */
    async getAllTimeBasedFlags(query) {
        const baseClause = {
            include: [
                {
                    model: DetectorSubsystem,
                    required: true,
                    attribute: ['name'],
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
        };

        const { count, rows } = await QualityControlFlagRepository.findAndCountAll(new QueryBuilder(baseClause).addFromHttpRequestQuery(query));
        return { count, rows: rows.map((qualityFlags) => qualityControlFlagAdapter.toEntity(qualityFlags)) };
    }

    /**
     * Create time based quality flag
     * @param {Object} entityParams - paramaters of new flag
     * @returns {Promise} Promise object represents the result of this use case.
     */
    async createTimeBasedQualityControlFlag(entityParams) {
        await QualityControlFlagRepository.create(entityParams);
    }

    /**
     * Delete time based quality flag
     * @param {Number} id - paramaters of new flag
     * @returns {Promise} Promise object represents the result of this use case.
     */
    async deleteTimeBasedQualityControlFlag(id) {
        return await QualityControlFlagRepository.removeOne({ where: { id } });
    }

    /**
     * Create verification for time based quality flag
     * @param {Object} entityParams - paramaters of new flag
     * @returns {Promise} Promise object represents the result of this use case.
     */
    async createTimeBasedQualityControlFlagVerification(entityParams) {
        await QualityControlFlagVerificationRepository.create(entityParams);
    }
}

module.exports = {
    qualityControlService: new QualityControlService(),
};
