/**
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

const meta = {
    SSO_DET_ROLE: 'det-',
};

const detectors = require('./detectors.js');

const dict = {
    Admin: 'admin',
    Global: 'global',
    Guest: 'guest',
};

/**
 * Produces roles like det-cpv present in config object under name DetectorCPV
 */
// eslint-disable-next-line no-return-assign
detectors.forEach((d) => dict[`Detector${d}`] = `det-${d.toLowerCase()}`);

module.exports = { meta, dict };
