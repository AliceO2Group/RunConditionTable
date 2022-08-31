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

import { h, switchCase } from '/js/src/index.js';

export default function tableHeader(visibleFields, data, model) {
    return h('thead',
        h('tr', columnsHeadersArray(visibleFields, data, model)
            .concat([rowsOptions(data, () => model.fetchedData.changeRecordsVisibility(data))])));
}

const orderToSymbol = (order) => switchCase(order, {
    1: '/\\',
    '-1': '\\/',
    null: '-',
}, 'TODO some runtime error');

const sortingChangeAction = (fName, data, model) => {
    data.sorting.field = fName;
    const { order } = data.sorting;
    data.sorting.order = switchCase(order, {
        1: -1,
        '-1': null,
        null: 1,
    }, null);
    data.sort();
    model.notify();
};

const columnsHeadersArray = (visibleFields, data, model) => visibleFields.map((f) => h('th', { scope: 'col' },
    h('.headerFieldName', [
        f.name,
        h('button', { onclick: () => sortingChangeAction(f.name, data, model) }, orderToSymbol(data.sorting.order)),
    ])));

const rowsOptions = (data, checkBoxFunction) =>
    h('th', { scope: 'col' }, h('.form-check.mv2', [
        h('input.form-check-input', {
            type: 'checkbox',
            onclick: checkBoxFunction,
            checked: data.hideMarkedRecords,
        }, ''),
        h('label.form-check-label', { for: 'hide-marked' }, 'Hide marked'),
    ]));
