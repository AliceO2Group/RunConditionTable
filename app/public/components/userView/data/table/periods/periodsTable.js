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
import tableHeader from '../header.js';
import row from '../row.js';
// A import { RCT } from '../../../../../config.js';

// A const pageName = RCT.pagesNames.periods;

function tableBody(model, visibleFields, data, cellsSpecials) {
    return h('tbody', { id: `table-body-${data.url}` },
        data.rows.map((item) => row(
            model, visibleFields, data, item, cellsSpecials,
        )));
}

export default function periodsTable(model, visibleFields, data, cellsSpecials) {
    return h('.x-scrollable-periods',
        h('table.periods-table', { id: `data-table-${data.url}` }, [
            tableHeader(visibleFields, data, model),
            tableBody(model, visibleFields, data, cellsSpecials),
        ]));
}
