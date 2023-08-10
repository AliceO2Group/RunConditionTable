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

export default function detectorSettings(userPreferences, close) {
    const title = h('h3.text-primary', 'Detector list');

    const detectors = () => h('.text-dark-blue', Object.keys(userPreferences.detectorList).map((detector) => [
        h('.flex-wrap.justify-between.items-center',
            h('.text-dark-blue', detector),
            h('input.toggle-switch', {
                type: 'checkbox',
                onclick: () => {
                    userPreferences.changeDetectorVisibility(detector);
                },
                checked: userPreferences.detectorList[detector] === true,
            })),
    ]));

    return h('.p-1em', [
        h('.flex.p-bottom-1em.justify-center.items-center',
            h('.detector-40-primary'),
            h('.p-left-1em', title)),

        detectors(),

        h('.flex-wrap.justify-center.items-center.p-1em.p-bottom-0',
            h('button.btn.btn-primary', {
                onclick: () => close(),
            }, 'Apply changes')),
    ]);
}
