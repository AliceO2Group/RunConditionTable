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

import { h, switchCase, iconCaretTop, iconCaretBottom, iconMinus } from '/js/src/index.js';
import { getHeaderSpecial, headerSpecPresent } from '../headersSpecials.js';

export default function tableHeader(visibleFields, data, model) {
    return h('thead',
        h('tr', columnsHeadersArray(visibleFields, data, model)
            .concat([rowsOptions(model, data)])));
}

const orderToSymbol = (fName, sorting) => fName == sorting.field ? switchCase(sorting.order, {
    1: iconCaretTop(),
    '-1': iconCaretBottom(),
    null: iconMinus(),
}, 'TODO some runtime error') : iconMinus();

const sortingChangeAction = (fName, data, model) => {
    if (data.sorting.field != fName) {
        data.sorting.field = fName;
        data.sorting.order = null;
    }
    data.sorting.order = switchCase(data.sorting.order, {
        1: -1,
        '-1': 1,
        null: -1,
    }, null);
    model.fetchedData.changeSorting(data.sorting);
};

const columnsHeadersArray = (visibleFields, data, model) =>
    visibleFields.map((f) => h('th', { scope: 'col' },
        h('.headerFieldName', [
            getHeaderSpecial(model, f),
            h('.p2',
                { onclick: () => headerSpecPresent(model, f) ? sortingChangeAction(f.name, data, model) : null },
                headerSpecPresent(model, f) ? orderToSymbol(f.name, data.sorting) : '.'),
        ])));

const rowsOptions = (model, data) =>
    h('th', { scope: 'col' },
        h('input.form-check-input.p1.mh4.justify-center.relative', {
            style: 'margin-left=0',
            type: 'checkbox',
            onclick: (e) => {
                // eslint-disable-next-line no-return-assign
                data.rows.forEach((r) => r.marked = e.target.checked);
                model.notify();
            },
            checked: data.rows.every((r) => r.marked),
        }, ''));
