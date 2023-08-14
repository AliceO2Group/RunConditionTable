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

export default function about() {
    const title = h('h3.text-primary', 'About');

    return h('.p-1rem', [
        h('.flex.p-bottom-1rem.justify-center.items-center',
            h('.settings-40-primary'),
            h('.p-left-1rem',
                title)),

        h('.flex-wrap.justify-between.items-center',
            h('.icon-placeholder-20-primary'),
            h('.text-dark-blue.ph2', 'Icons by'),

            h('a', {
                target: '_blank',
                href: 'https://icons8.com/',
            }, 'Icons8')),
    ]);
}
