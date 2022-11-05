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
import viewButton from '../../../common/viewButton.js';

export default function failureStatusAndReload(model, status) {
    const reloadBtn = viewButton(
        model,
        'Reload',
        () => model.fetchedData.reqForData(true),
        '',
        undefined,
        '.btn-primary.m3',
    );
    const loadingMessage = h('h3', 'Failed to load data');
    const explanation = h('h5', `The services are unavailable (status: ${status ? status : 'unknown'})`);

    return h('.loginDiv.top-100', [
        h('.no-network-90'),
        loadingMessage,
        explanation,
        reloadBtn,
    ]);
}
