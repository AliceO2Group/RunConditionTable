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
import { RCT } from '../../../../config.js';

export default function row(
    model, visibleFields, data, item, cellsSpecials, index, runs, detectors,
) {
    const pageName = RCT.pageNames.runsPerPeriod;
    const rowDivDef = reduceSerialIf(
        'tr.track', ['.row-not-selected', '.d-none'], ['.row-selected', ''],
        [!item.marked, data.hideMarkedRecords && item.marked], (a, b) => a + b,
    );

    const dataCells = visibleFields.filter((field) => !/.*_detector/.test(field.name)).map((field) =>
        h(`td.${pageName}-${field.name}-cell.text-ellipsis`,
            item[field.name]
                ? cellsSpecials[field.name]
                    ? cellsSpecials[field.name](model, item)
                    : item[field.name]
                : ''));

    const detectorCells = visibleFields.filter((field) =>
        /.*_detector/.test(field.name) &&
        model.userPreferences.detectorList[field.name.slice(0, 3).toUpperCase()] === true).map((field) =>
        h(`td.${pageName}-detector-cell.text-ellipsis`,
            item[field.name]
                ? detectorIcon(model.navigation, item, index, detectors.getDetectorName(field.name), true)
                : ''));

    const checkbox = h('td.relative.track',
        h(`input.checkbox.abs-center${item.marked ? '.ticked' : ''}`, {
            type: 'checkbox',
            checked: item.marked,
            onclick: () => {
                model.fetchedData.changeItemStatus(item);
                model.notify();
            },
        }));

    return h(rowDivDef, [checkbox].concat(dataCells).concat(detectorCells));
}
