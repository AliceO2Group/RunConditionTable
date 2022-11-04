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

// eslint-disable-next-line no-unused-vars
const detectorIcon = (model, item, n) =>
    h('.tooltip',
        h('svg', { width: '50px', height: '50px' },
            h('circle',
                {
                    cx: '50%',
                    cy: '50%',
                    r: '15px',
                    stroke: 'black',
                    'stroke-width': '3',
                    fill: 'green',
                })),
        h('span.tooltiptext', `run_det_id: ${item[n]}`));

export default function row(
    model, visibleFields, data, item, cellsSpecials,
) {
    const rowDivDef = reduceSerialIf(
        'tr.track', ['.bg-grey', '.d-none'], ['.row-selected-color-alpha.bg-grey.selected', ''],
        [!item.marked, data.hideMarkedRecords && item.marked], (a, b) => a + b,
    );

    const dataCells = visibleFields.map((f) => {
        const n = f.name;
        if (item[n]) {
            if (cellsSpecials[n]) {
                return h('td', cellsSpecials[n](model, item));
            } else if (/.*_detector/.test(f.name)) {
                return h('td', detectorIcon(model, item, n));
            } else {
                return h('td', item[n]);
            }
        } else {
            return h('td', '.');
        }
    });

    const checkbox = h('td.relative', h(`input.vertical-center${item.marked ? '.ticked' : ''}`, {
        type: 'checkbox',
        checked: item.marked,
        onclick: () => {
            model.fetchedData.changeItemStatus(item);
            model.notify();
        },
    }));

    return h(rowDivDef, [checkbox].concat(dataCells));
}
