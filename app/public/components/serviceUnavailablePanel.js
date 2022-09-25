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
import viewButton from './common/viewButton.js';
import container from './common/container.js';

export default function serviceUnavailablePanel(model) {
    const loginButton = viewButton(model, 'retry', () => model.retry());
    const title = h('h1.primary', 'Service unavailable');

    return h('div.loginDiv', h('div.loginDivInside', [
        title,
        container(loginButton),
        h('.p1'),
        container(h('div.loginDivInsid.notification-content.shadow-level3.bg-danger.white.br2.p2.notification-close',
            { id: 'serviceUnavailableMessageFieldID' },
            '')),
    ]));
}
