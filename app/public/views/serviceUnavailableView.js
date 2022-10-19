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
import container from '../components/common/container.js';

export default function serviceUnavailablePanel(model) {
    const retryBtn = h('button.btn.br-primary.m4.p4', { onclick: () => model.retry() }, 'Retry');
    const title = h('h1.primary.justify-center', 'Run Condition Table');
    const subtitle = h('h3.danger.justify-center', 'Service temporarily unavailable');

    return h('div.loginDiv', h('div.loginDiv.bg-gray-lighter.br3.p4', [
        title,
        subtitle,
        h('.p1'),
        container(h('div.loginDivInsid.notification-content.shadow-level3.bg-danger.white.br2.p2.notification-close',
            { id: 'serviceUnavailableMessageFieldID' },
            '')),
        container(retryBtn),

    ]));
}
