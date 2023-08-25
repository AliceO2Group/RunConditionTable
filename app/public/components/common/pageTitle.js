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

export const pageTitle = (page, pageNames) => {
    switch (page) {
        case pageNames.periods: return 'Periods';
        case pageNames.runsPerPeriod: return 'Runs per period';
        case pageNames.runsPerDataPass: return 'Runs per data pass';
        case pageNames.dataPasses: return 'Data passes per period';
        case pageNames.mc: return 'Monte Carlo';
        case pageNames.flags: return 'Quality flags';
        case pageNames.anchoragePerDatapass: return 'Anchorage per data pass';
        case pageNames.anchoredPerMC: return 'Anchored per MC';
        default: return page;
    }
};
