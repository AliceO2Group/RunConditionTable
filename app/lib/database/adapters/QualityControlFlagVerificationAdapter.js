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

class QualityControlFlagVerificationAdapter {

    /**
     * Converts the given database object to an entity object.
     *
     * @param {SequelizeQualityControlFlagVerification} databaseObject Object to convert.
     * @returns {QualityControlFlagVerification} Converted entity object.
     */
    toEntity(databaseObject) {
        const {
            id,
            verifiedBy,
            verification_time,
        } = databaseObject;

        return {
            id,
            verifiedBy,
            verifiedAt: verification_time,
        }
    }

    /**
     * Converts the given entity object to database object.
     *
     * @param {QualityControlFlagVerification} databaseObject Object to convert.
     * @returns {SequelizeQualityControlFlagVerification} Converted entity object.
     */
    toDatabase(entityObject) {
        const {
            id,
            verifiedBy,
            verifiedAt: verification_time,
        } = entityObject;

        return {
            id,
            verifiedBy,
            verification_time,
        };
    }
}

module.exports = QualityControlFlagVerificationAdapter;
