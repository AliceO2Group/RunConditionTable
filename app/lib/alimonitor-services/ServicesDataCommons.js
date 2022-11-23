/**
 *
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const Utils = require('../Utils.js');
const { databasePersistance } = require('../config/configProvider.js');

class ServicesDataCommons {
    /**
     * Update objectData.beam_type to valid format if mapping is provided with app config
     * if not there is assumption that in other scenerio name is consistant with foramt '<typeA>-<typeB>'
     * @param {Object} dataObject o
     * @returns {Object} dataObject
     */
    static mapBeamTypeToCommonFormat(dataObject) {
        dataObject.beam_type = Utils.switchCase(
            dataObject.beam_type,
            databasePersistance.beam_type_mappings,
            dataObject.beam_type,
        );
        return dataObject;
    }
}

module.exports = ServicesDataCommons;
