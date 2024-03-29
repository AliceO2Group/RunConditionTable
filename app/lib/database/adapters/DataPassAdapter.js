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

class DataPassAdapter {
    /**
     * Converts the given database object to an entity object.
     *
     * @param {SequelizeDataPass} databaseObject Object to convert.
     * @returns {DataPass} Converted entity object.
     */
    toEntity(databaseObject) {
        const {
            id,
            name,
            description,
            reconstructedEvents,
            outputSize,
            runsCount,
            simulationPassesCount,
        } = databaseObject.dataValues;

        return {
            id,
            name,
            description,
            reconstructedEvents,
            outputSize,
            runsCount: Number(runsCount),
            simulationPassesCount: Number(simulationPassesCount),
        };
    }

    /**
     * Converts the given entity object to database object.
     *
     * @param {DataPass} entityObject Object to convert.
     * @returns {SequelizeDataPass} Converted entity object.
     */
    toDatabase(entityObject) {
        return entityObject;
    }
}

module.exports = DataPassAdapter;
