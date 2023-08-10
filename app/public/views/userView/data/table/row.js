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
import detectorIcon from '../../../../components/detectors/detectorIcon.js';

export default function row(
    model, visibleFields, data, item, cellsSpecials, index, runs, detectors,
) {
    const pageName = model.getCurrentDataPointer().page;
    const rowDivDef = reduceSerialIf(
        'tr.track', ['.row-not-selected', '.d-none'], ['.row-selected', ''],
        [!item.marked, data.hideMarkedRecords && item.marked], (a, b) => a + b,
    );

    // Const detecorCells

    const dataCells = visibleFields.map((field) =>
        h(`td.${pageName}-${field.name.includes('detector') ? 'detector' : field.name}-cell.text-ellipsis`,
            item[field.name]
                ? cellsSpecials[field.name]
                    ? pageName === 'dataPasses'
                        ? cellsSpecials[field.name](model, runs, item)
                        : cellsSpecials[field.name](model, item)
                    : /.*_detector/.test(field.name)
                        ? detectorIcon(model.navigation, item, index, detectors.getDetectorName(field.name))
                        : item[field.name]
                : '..'));

    const checkbox = h('td.relative.track',
        h(`input.checkbox.abs-center${item.marked ? '.ticked' : ''}`, {
            type: 'checkbox',
            checked: item.marked,
            onclick: () => {
                model.fetchedData.changeItemStatus(item);
                model.notify();
            },
        }));

    return h(rowDivDef, [checkbox].concat(dataCells));
}
