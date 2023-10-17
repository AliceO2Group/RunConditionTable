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

const DetectorSubsystemAdapter = require('./DetectorSubsystemAdapter');

class RunAdapter {
    constructor() {
        this.detectorSubsystemAdapter = new DetectorSubsystemAdapter();
    }

    /**
     * Converts the given database object to an entity object.
     *
     * @param {SequelizeRun} databaseObject Object to convert.
     * @returns {Run} Converted entity object.
     */
    toEntity(databaseObject) {
        const {
            runNumber,
            timeO2Start,
            timeO2End,
            timeTrgStart,
            timeTrgEnd,
            startTime,
            endTime,
            runDuration,
            fillNumber,
            lhcBeamEnergy,
            l3CurrentVal,
            dipoleCurrentVal,
            DetectorSubsystems,
        } = databaseObject;

        return {
            runNumber,
            timeO2Start,
            timeO2End,
            timeTrgStart,
            timeTrgEnd,
            startTime,
            endTime,
            runDuration,
            fillNumber,
            lhcBeamEnergy,
            l3CurrentVal,
            dipoleCurrentVal,
            detectorSubsystems: DetectorSubsystems?.map(this.detectorSubsystemAdapter.toEntity.bind(this.detectorSubsystemAdapter)),
        };
    }

    /**
     * Converts the given entity object to database object.
     *
     * @param {Run} entityObject Object to convert.
     * @returns {SequelizeRun} Converted entity object.
     */
    toDatabase(entityObject) {
        const {
            runNumber,
            timeO2Start,
            timeO2End,
            timeTrgStart,
            timeTrgEnd,
            fillNumber,
            lhcBeamEnergy,
            l3CurrentVal,
            dipoleCurrentVal,
        } = entityObject;

        return {
            runNumber,
            timeO2Start,
            timeO2End,
            timeTrgStart,
            timeTrgEnd,
            fillNumber,
            lhcBeamEnergy,
            l3CurrentVal,
            dipoleCurrentVal,
        };
    }
}

module.exports = RunAdapter;
