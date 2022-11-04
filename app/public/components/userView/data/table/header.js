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
import { getHeaderSpecial, headerSpecPresent } from '../headersSpecials.js';
import { sort } from '../../../../utils/sort.js';

export default function tableHeader(visibleFields, data, model) {
    return h('thead',
        h('tr', [rowsOptions(model, data)].concat(
            columnsHeadersArray(visibleFields, data, model),
        )));
}

const columnsHeadersArray = (visibleFields, data, model) =>
    visibleFields.map((f) => h('th', { scope: 'col' },
        h('.relative', [
            headerSpecPresent(model, f) ? [
                h('div.sort-up-20', {
                    onclick: () => sort(f.name, data, model, -1),
                    class: data.sorting.order === -1 && data.sorting.field === f.name ? 'selected' : '',
                }),
                h('div.sort-down-20', {
                    onclick: () => sort(f.name, data, model, 1),
                    class: data.sorting.order === 1 && data.sorting.field === f.name ? 'selected' : '',
                }),
            ] : '',
            h('.vertical-center.mh4', getHeaderSpecial(model, f)),
        ])));

const rowsOptions = (model, data) =>
    h('th', { scope: 'col' },
        h('.relative',
            h(`input.vertical-center${data.rows.every((r) => r.marked) ? '.ticked' : ''}`, {
                type: 'checkbox',
                onclick: (e) => {
                    for (const row of data.rows) {
                        row.marked = e.target.checked;
                    }
                    model.notify();
                },
                checked: data.rows.every((r) => r.marked),
            })));
