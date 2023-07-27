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
export default function sessionErrorPanel(model) {
    const retryBtn = h('button.btn.br-primary.m4.p4', { onclick: () => model.login() }, 'Retry login');
    const title = h('h1.primary.justify-center', 'Run Condition Table');
    const subtitle = h('h3.danger.justify-center', 'Session Error');

    return h('div.panel', h('div.panel.bg-gray-lighter.br3.p4', [
        title,
        subtitle,
        h('.p1'),
        h('.flex-wrap.justify-center', retryBtn),
    ]));
}
