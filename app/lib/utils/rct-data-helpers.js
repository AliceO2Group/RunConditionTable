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
    extractPeriodYear,
};
