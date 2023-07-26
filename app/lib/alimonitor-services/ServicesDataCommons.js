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

const Utils = require('../utils');
const { rctData } = require('../config/configProvider.js');

/**
 * Update objectData.beam_type to valid format if mapping is provided with app config
 * if not there is assumption that in other scenerio name is consistant with foramt '<typeA>-<typeB>'
 * @param {Object} dataObject o
 * @returns {Object} dataObject
 */
function mapBeamTypeToCommonFormat(dataObject) {
    dataObject.beam_type = Utils.switchCase(
        dataObject.beam_type,
        rctData.mapping.beamTypes,
        { default: dataObject.beam_type },
    );
    return dataObject;
}

/**
 * Extract year from data/simulation pass name
 * @param {string} name name of pass, like LHC22a_apass1
 * @returns {Number} year
 */
function extractPeriodYear(name) {
    try {
        const year = parseInt(name.slice(3, 5), 10);
        if (isNaN(year)) {
            return 'NULL';
        }
        return year > 50 ? year + 1900 : year + 2000;
    } catch (e) {
        return 'NULL';
    }
}

module.exports = {
    mapBeamTypeToCommonFormat,
    extractPeriodYear,
};
