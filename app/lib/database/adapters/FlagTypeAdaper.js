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

class FlagTypeAdapter {
 
    /**
     * Converts the given database object to an entity object.
     *
     * @param {SequelizeFlagType} databaseObject Object to convert.
     * @returns {FlagType} Converted entity object.
     */
    toEntity(databaseObject) {
        const {
            id,
            name,
            method,
            bad,
            obsolate,
        } = databaseObject;

        return {
            id,
            name,
            method,
            bad,
            obsolate,
        };
    }

    /**
     * Converts the given entity object to database object.
     *
     * @param {FlagType} databaseObject Object to convert.
     * @returns {SequelizeFlagType} Converted entity object.
     */
    toDatabase(entityObject) {
        return entityObject;
    }
}

module.exports = FlagTypeAdapter;
