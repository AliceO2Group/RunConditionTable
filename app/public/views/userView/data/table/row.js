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
const RCT = window.RCT_CONF;
import { rowDisplayStyle } from '../../../../utils/dataProcessing/dataProcessingUtils.js';

export default function row(
    model, visibleFields, data, item, cellsSpecials, runs,
) {
    const pageName = model.getCurrentDataPointer().page;

    const dataCells = visibleFields.map((field) =>
        h(`td.${pageName}-${field.name}-cell.text-ellipsis`,
            item[field.name]
                ? cellsSpecials[field.name]
                    ? pageName === RCT.pageNames.dataPasses
                        ? cellsSpecials[field.name](model, runs, item)
                        : cellsSpecials[field.name](model, item)
                    : item[field.name]
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

    return h(`tr.track${rowDisplayStyle(item.marked, data.hideMarkedRecords)}`,
        checkbox,
        dataCells);
}
