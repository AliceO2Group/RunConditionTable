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
import failureStatusAndReload from './fetchingStates/failure.js';
import unknownError from './fetchingStates/unknownError.js';
import { RCT } from '../../../config.js';
import flagsPanel from '../../flags/overview/flagsPanel.js';
import { default as runsPerDataPassPanel } from '../../runs/runsPerDataPass/overview/panel.js';
import waitingPanel from '../../waitingPanel.js';
const { pageNames } = RCT;

/**
 * Create vnode tablePanel if data are fetched otherwise shows spinner
 * @param model
 * @returns {*}
 */

export default function dataPanel(model, runs, detectors, flags) {
    const { page, index } = model.getCurrentDataPointer();
    const data = model.fetchedData[page][index];

    return data ? data.match({
        NotAsked: () => unknownError(model),
        Loading: () => waitingPanel(),
        Success: () => {
            switch (page) {
                case pageNames.flags:
                    return flagsPanel(model, runs, detectors, flags);
                case pageNames.runsPerDataPass:
                    return runsPerDataPassPanel(model, runs, detectors);
                default:
                    return tablePanel(model, runs, detectors);
            }
        },
        Failure: (status) => failureStatusAndReload(model, status),
    }) : unknownError(model);
}
