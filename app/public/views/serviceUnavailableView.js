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

export default function serviceUnavailablePanel(model) {
    let submodel = model.submodels[model.mode];
    const retryBtn = h('button.btn.btn-primary.m3', { onclick: () => submodel.retry() }, 'Retry');
    const title = h('h1.primary', 'Run Condition Table');
    const subtitle = h('h3', 'Service temporarily unavailable');

    return h('.loginDiv.top-100', [
        title,
        h('.no-network-90'),
        subtitle,
        h('.notification-content.shadow-level3.bg-danger.white.br2.p2.notification-close',
            { id: 'serviceUnavailableMessageFieldID' },
            ''),
        retryBtn,
    ]);
}
