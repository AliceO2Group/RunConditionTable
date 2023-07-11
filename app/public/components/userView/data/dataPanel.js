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

import { h } from '/js/src/index.js';
import tablePanel from './table/tablePanel.js';
import spinnerAndReloadView from './fetchingStates/loading.js';
import failureStatusAndReload from './fetchingStates/failure.js';
import unknownError from './fetchingStates/unknown.js';
import { RCT } from '../../../config.js';
import flagsPanel from './flags/flagsPanel.js';
const { pagesNames } = RCT;

/**
 * Create vnode tablePanel if data are fetched otherwise shows spinner
 * @param model
 * @returns {*}
 */

export default function dataPanel(model) {
    const { page, index } = model.getCurrentDataPointer();
    const data = model.fetchedData[page][index];

    return data ? data.match({
        NotAsked: () => h('', 'not asked'),
        Loading: () => spinnerAndReloadView(model),
        Success: () => page === pagesNames.flags ? flagsPanel(model) : tablePanel(model),
        Failure: (status) => failureStatusAndReload(model, status),
    }) : unknownError(model);
}
