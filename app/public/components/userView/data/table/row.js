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

const detectorIcon = (model, item, n, index) =>
    h('button.btn.transparent.tooltip.noBorderBottom.pointer', {
        onclick: () => {
            model.router.go(`/?page=flags&data_pass_name=${index}&run_numbers=${item.run_number}&rows-on-site=50&site=1`);
        },
    },
    h('svg', { width: '20px', height: '20px' },
        h('circle',
            {
                cx: '50%',
                cy: '50%',
                r: '8px', //

                /*
                 *Stroke: '#F7B538', strokes for the limited acceptance flags only
                 *'stroke-width': '3',
                 */
                fill: '#8CB369',
            })),
    h('span.detector-tooltip-field', `run_det_id: ${item[n]}`));

export default function row(
    model, visibleFields, data, item, cellsSpecials, index,
) {
    const rowDivDef = reduceSerialIf(
        'tr.track', ['.row-not-selected', '.d-none'], ['.row-selected', ''],
        [!item.marked, data.hideMarkedRecords && item.marked], (a, b) => a + b,
    );

    const dataCells = visibleFields.map((field) =>
        h(`td.${model.getCurrentDataPointer().page}-${field.name.includes('detector') ? 'detector' : field.name}-cell`,
            item[field.name]
                ? cellsSpecials[field.name]
                    ? cellsSpecials[field.name](model, item)
                    : /.*_detector/.test(field.name)
                        ? detectorIcon(model, item, field.name, index)
                        : item[field.name]
                : '..'));

    const checkbox = h('td.relative.track',
        h(`input.abs-center${item.marked ? '.ticked' : ''}`, {
            type: 'checkbox',
            checked: item.marked,
            onclick: () => {
                model.fetchedData.changeItemStatus(item);
                model.notify();
            },
        }));

    return h(rowDivDef, [checkbox].concat(dataCells));
}
