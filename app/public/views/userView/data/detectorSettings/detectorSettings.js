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

export default function detectorSettings(userPreferences) {
    const title = h('h3.text-primary', 'Detector list');

    const isVisible = (detector) => userPreferences.detectorList[detector] === true;
    const switchInputId = (detector) => `switch-input-${detector}`;

    const detectors = () => h('.text-dark-blue', Object.keys(userPreferences.detectorList).map((detector) => [
        h('.flex-wrap.justify-between.items-center',
            h('.text-dark-blue', detector),
            h('.switch',
                h('input', {
                    id: switchInputId(detector),
                    type: 'checkbox',
                    checked: isVisible(detector),
                }),
                h('span.slider.round', {
                    onclick: () => {
                        userPreferences.changeDetectorVisibility(detector);
                        document.getElementById(switchInputId(detector)).checked = isVisible(detector);
                    },
                }))),
    ]));

    return h('.p-1rem', [
        h('.flex.p-bottom-1rem.justify-center.items-center',
            h('.detector-40-primary'),
            h('.p-left-1rem', title)),

        detectors(),
    ]);
}
