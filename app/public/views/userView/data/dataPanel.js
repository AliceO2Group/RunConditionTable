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

import tablePanel from './table/tablePanel.js';
import flagsPanel from '../../flags/overview/flagsPanel.js';
import { default as runsPerDataPassPanel } from '../../runs/runsPerDataPass/overview/panel.js';
import { default as runsPerPeriodPanel } from '../../runs/runsPerPeriod/overview/panel.js';
import { failure, unknown, waiting } from '../../../components/messagePanel/messages.js';
import { RCT } from '../../../config.js';
import periodsPanel from '../../periods/overview/periodsPanel.js';
const { pageNames } = RCT;

/**
 * Create vnode tablePanel if data are fetched otherwise shows spinner
 * @param model
 * @returns {*}
 */

export default function dataPanel(dataAccess, runs, detectors, flags, model) {
    const { page, index } = dataAccess.getCurrentDataPointer();
    const data = dataAccess.fetchedData[page][index];

    return data ? data.match({
        NotAsked: () => unknown(dataAccess),
        Loading: () => waiting(),
        Success: () => {
            switch (page) {
                case pageNames.periods:
                    return periodsPanel(model);
                case pageNames.flags:
                    return flagsPanel(dataAccess, runs, detectors, flags);
                case pageNames.runsPerDataPass:
                    return runsPerDataPassPanel(dataAccess, runs, detectors);
                case pageNames.runsPerPeriod:
                    return runsPerPeriodPanel(dataAccess, runs, detectors);
                default:
                    return tablePanel(dataAccess, runs);
            }
        },
        Failure: (status) => failure(dataAccess, status),
    }) : unknown(dataAccess);
}
