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
import { RCT } from '../../../../config.js';
import { rowDisplayStyle } from '../../../../utils/dataProcessing/dataProcessingUtils.js';

export default function runsPerPeriodTableRow(runData, navigation, runsModel) {
    const pageName = RCT.pageNames.runsPerPeriod;

    const dataCells = runsModel.visibleFields.map((field, index) =>
        h(`td.${pageName}-${field.name}-cell.text-ellipsis`,
            runData[field.name]
                ? runsModel.visibleFields[index].format(navigation, runData)
                : 'hello'));

    const checkbox = h('td.relative.track',
        h(`input.checkbox.abs-center${runData.selected ? '.ticked' : ''}`, {
            type: 'checkbox',
            checked: runData.selected,
            onclick: () => {
                runsModel.toggleSelection(runData);
            },
        }));

    return h(`tr.track${rowDisplayStyle(runData.selected, runsModel.shouldHideSelectedRows)}`,
        checkbox,
        dataCells);
}
