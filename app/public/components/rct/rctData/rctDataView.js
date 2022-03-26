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
import tableView from './tableView.js';
import spinner from '../../common/spinner.js';
import viewButton from '../../common/viewButton.js';

/**
 * Create vnode tableView if data are fetched otherwise shows spinner
 * @param model
 * @returns {*}
 */

export default function rctDataView(model) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index];

    return h('.homePage', [
        h('div.tableDiv', []),

        data ? data.match({
            NotAsked: () => h('', 'not asked'),
            Loading: () => spinnerAndReloadView(model),
            Success: () => tableView(model),
            Failure: (status) => failureStatusAndReload(model, status),
        }) : h('', 'data null :: Arrr...'),
    ]);
}

function spinnerAndReloadView(model) {
    return h('.item-center.justify-center', [
        viewButton(model, 'reload data', () => model.fetchedData.reqForData(true), 'reload-btn'),
        spinner(),
    ]);
}

function failureStatusAndReload(model, status) {
    return h('.item-center.justify-center', [
        viewButton(model, 'reload data', () => model.fetchedData.reqForData(true), 'reload-btn'),
        h('', status),
    ]);
}
