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
const pageNames = require('./pageNames.js');

const viewTypes = {
    periods: 'periods',
    runs: 'runs',
    dataPasses: 'dataPasses',
    mc: 'mc',
    flags: 'flags',
};

const pagesViewGroups = {
    periods: [pageNames.periods],
    runs: [pageNames.runsPerDataPass, pageNames.runsPerPeriod],
    dataPasses: [pageNames.anchoredPerMC, pageNames.dataPasses],
    mc: [pageNames.mc, pageNames.anchoragePerDatapass],
    flags: [pageNames.flags],
};

module.exports = { viewTypes, pagesViewGroups };
