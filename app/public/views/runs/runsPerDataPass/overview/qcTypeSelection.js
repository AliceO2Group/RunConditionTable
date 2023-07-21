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

export default function qcTypeSelection(model, close, item, index, detectorName) {
    const title = h('h3', 'Quality Control type');
    const flagsUrl = `/?page=flags&data_pass_name=${index}&run_numbers=${item.run_number}&detector=${detectorName}&rows-on-site=50&site=1`;

    return h('', [
        h('.flex.bottom-20.justify-center.items-center',
            h('.settings-40'),
            h('.inline.top-15.left-10',
                title)),

        h('.flex-wrap.justify-center.items-center',
            h('button.btn.btn-primary.m1', {
                onclick: () => model.router.go(flagsUrl),
            }, 'Run based')),

        h('.flex-wrap.justify-center.items-center',
            h('button.btn.btn-primary.m1', {
                onclick: () => model.router.go(flagsUrl),
            }, 'Time based')),
    ]);
}
