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

const { databaseManager: {
    repositories: {
        PeriodRepository,
        BeamTypeRepository,
    },
} } = require('../../database/DatabaseManager');

/**
 * Find or create beam type
 * @param {String} beamType beam type e.g. p-p, p-Pb, ...
 * @returns {[SequelizeBeamType, boolean]} result of sequelize.Model.findOrCreate
 */
const findOrCreateBeamType = async (beamType) =>
    await BeamTypeRepository.findOrCreate({
        where: {
            name: beamType,
        },
    })
        .catch((e) => {
            throw new Error('Find or create beam type failed', {
                cause: {
                    error: e.message,
                    meta: {
                        explicitValues: {
                            name: beamType,
                        },
                    },
                },
            });
        });

const periodErrorHandlerFactory = ({ name, year, beamType, BeamTypeId }) => (e) => {
    throw new Error('Find/Upsert or create period with given beam type failed', {
        cause: {
            error: e.message,
            meta: {
                explicitValues: {
                    name,
                    year,
                    BeamTypeId,
                },
                implicitValues: {
                    BeamType: beamType,
                },
            },
        },
    });
};

/**
 * Find or create period with given parameters
 * @param {Period} period as {name, year, beamType}
 * @returns {[SequelizePeriod, boolean]} result of sequelize.Model.findOrCreate
 */
const findOrCreatePeriod = async (period) =>
    await findOrCreateBeamType(period.beamType)
        .then(async ([dbBeamType, _]) => await PeriodRepository.findOrCreate({
            where: {
                name: period.name,
            },
            defaults: {
                name: period.name,
                year: period.year,
                BeamTypeId: dbBeamType.id,
            },
        }))
        .catch(periodErrorHandlerFactory(period));

/**
 * Upsert or create period with given parameters
 * @param {Period} period as {name, year, beamType}
 * @returns {[SequelizePeriod, boolean]} result of sequelize.Model.findOrCreate
 */
const upsertOrCreatePeriod = async (period) => {
    const { name, year, beamType } = period;

    return await findOrCreateBeamType(beamType)
        .then(async ([dbBeamType, _]) => [dbBeamType, await PeriodRepository.findOne({ where: { name } })])
        .then(([dbBeamType, dbPeriod]) => {
            if (dbPeriod) {
                return PeriodRepository.updateOne(dbPeriod, { year, BeamTypeId: dbBeamType.id });
            } else {
                return PeriodRepository.create({ name, year, BeamTypeId: dbBeamType.id });
            }
        })
        .catch(periodErrorHandlerFactory(period));
};

module.exports = {
    findOrCreatePeriod,
    upsertOrCreatePeriod,
};
