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
import { getHeaderSpecial, headerSpecPresent, nonDisplayable } from '../../headersSpecials.js';
import fields from './fields.js';

export default function flagsTableHeader(data, model) {
    const displayedFields = fields.filter((e) => e.display === true);
    const columnsHeadersArray = (fields, model) =>
        fields.map((f) => [
            h(`th.${model.getCurrentDataPointer().page}-header`, {
                scope: 'col',
            }, h('.relative', [
                headerSpecPresent(model, f) !== nonDisplayable ?
                    h('.inline', getHeaderSpecial(model, f))
                    : 'aaa',
            ])),
        ]);

    const rowsOptions = (model, data) =>
        h('th', { scope: 'col' },
            h('.relative',
                h(`input.abs-center${data.every((r) => r.marked) ? '.ticked' : ''}`, {
                    type: 'checkbox',
                    onclick: (e) => {
                        for (const row of data) {
                            row.marked = e.target.checked;
                        }
                        model.notify();
                    },
                    checked: data.every((r) => r.marked),
                })));

    return h('thead.header',
        h('tr', [rowsOptions(model, data)].concat(columnsHeadersArray(displayedFields, model))));
}
