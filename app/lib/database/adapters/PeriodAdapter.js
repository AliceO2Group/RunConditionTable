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


class PeriodAdapter {
    /**
     * Converts the given database object to an entity object.
     *
     * @param {SequelizePeriod} databaseObject Object to convert.
     * @returns {Period} Converted entity object.
     */
    toEntity(databaseObject) {
        const {
            id,
            name,
            year,
            BeamType: {
                id: BeamTypeId,
                name: BeamTypeName,
            },
            energy,
        } = databaseObject;

        return {
            id,
            name,
            year,
            BeamTypeId:
            BeamTypeName,
            energy,
        }
    }

    /**
     * Converts the given entity object to database object.
     *
     * @param {Period} databaseObject Object to convert.
     * @returns {SequelizePeriod} Converted entity object.
     */
    toDatabase(entityObject) {
        const {
            id,
            name,
            year,
            BeamTypeId,
            BeamTypeName,
        } = entityObject;

        return {
            id,
            name,
            year,
            BeamType: {
                id: BeamTypeId,
                name: BeamTypeName,
            }
        }
    }
}

module.exports = PeriodAdapter;
