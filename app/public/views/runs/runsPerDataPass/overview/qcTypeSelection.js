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

import { h, iconChevronBottom } from '/js/src/index.js';
import quantityInput from '../../../../components/common/quantityInput.js';
import { RCT } from '../../../../config.js';

export default function qcTypeSelection(model, close) {
    const title = h('h3', 'Quality Control type');

    return h('', [
        h('.flex.bottom-20.justify-center.items-center',
            h('.settings-40'),
            h('.inline.top-15.left-10',
                title)),

        h('.flex-wrap.justify-center.items-center',
            h('button.btn.btn-primary.m1', {
                onclick: () => console.log('clicked!'),
            }, 'Apply changes')),
    ]);
}
