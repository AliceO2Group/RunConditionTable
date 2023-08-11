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

const FlagTypeAdapter = require('./FlagTypeAdaper');
const QualityControlFlagVerificationAdapter = require('./QualityControlFlagVerificationAdapter');
const DetectorSubsystemAdapter = require('./DetectorSubsystemAdapter');

class QualityControlFlagAdapter {
    constructor() {
        this.flagTypeAdapter = new FlagTypeAdapter();
        this.qualityControlFlagVerificationAdapter = new QualityControlFlagVerificationAdapter();
    }

    /**
     * Converts the given database object to an entity object.
     *
     * @param {SequelizeQualityControlFlag} databaseObject Object to convert.
     * @returns {QualityControlFlag} Converted entity object.
     */
    toEntity(databaseObject) {
        const {
            id,
            data_pass_id,
            run_number,
            detector_id,
            timeStart,
            timeEnd,
            comment,
            addedBy,
            additionTime,
            lastModificationTime,
            FlagType: flagType,
            QualityControlFlagVerifications: verifications,
        } = databaseObject;

        return {
            id,
            data_pass_id,
            run_number,
            detector_id,
            timeStart,
            timeEnd,
            comment,
            addedBy,
            additionTime: Number(additionTime),
            lastModificationTime: Number(lastModificationTime),
            flagType: this.flagTypeAdapter.toEntity(flagType),
            verifications: verifications.map((verification) => this.qualityControlFlagVerificationAdapter.toEntity(verification)),
        }
    }

    /**
     * Converts the given entity object to database object.
     *
     * @param {QualityControlFlag} databaseObject Object to convert.
     * @returns {SequelizeQualityControlFlag} Converted entity object.
     */
    toDatabase(entityObject) {
        const {
            id,
            data_pass_id,
            run_number,
            detector_id,
            timeStart,
            timeEnd,
            comment,
            addedBy,
            additionTime,
            lastModificationTime,
            flagType: FlagType,
            verifications,
        } = entityObject;

        return {
            id,
            data_pass_id,
            run_number,
            detector_id,
            timeStart,
            timeEnd,
            comment,
            addedBy,
            additionTime,
            lastModificationTime,
            FlagType: this.flagTypeAdapter.toDatabase(FlagType),
            QualityControlFlagVerifications: verifications.map((verification) => this.qualityControlFlagVerificationAdapter.toDatabase(verification)),
        };
    }
}

module.exports = QualityControlFlagAdapter;
