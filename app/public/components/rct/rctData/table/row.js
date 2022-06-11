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
import { reduceSerialIf } from '../../../../utils/utils.js';

export default function row(model, visibleFields, data, item, cellsButtons) {
    return h(
        reduceSerialIf(
            'tr',
            ['.bg-grey', '.d-none'],
            ['.bg-warning', ''],
            [!item.marked, data.hideMarkedRecords && item.marked],
            (a, b) => a + b,
        ),
        visibleFields
            .map((f) => {
                const n = f.name;
                if (item[n]) {
                    if (cellsButtons[n]) {
                        return h('td', cellsButtons[n](model, item, n));
                    } else {
                        return h('td', item[n]);
                    }
                } else {
                    return h('td', `${n}__tmp_`);
                }
            })
            .concat([
                h(
                    'td',
                    h('input.form-check-input.p1.mh4.justify-center.relative', {
                        style: 'margin-left=0',
                        type: 'checkbox',
                        checked: item.marked,
                        onclick: () => model.fetchedData.changeItemStatus(item),
                    }),
                ),
            ]),
    );
}
