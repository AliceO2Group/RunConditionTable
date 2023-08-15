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

import { h, iconChevronBottom } from '/js/src/index.js';
import newItemsCounter from './newItemsCounter.js';

const columnDisplayOptions = {
    nonEmpty: 'nonEmty',
    all: 'all',
};

export default function newPager(periodsModel, model) {
    const columnOptionsSelectId = 'columns-option-select-id';

    function handleOptionChange() {
        const columnsOptionsSelect = document.getElementById(columnOptionsSelectId);
        const selectedValue = columnsOptionsSelect.options[columnsOptionsSelect.selectedIndex].value;
        switch (selectedValue) {
            case columnDisplayOptions.nonEmpty:
                periodsModel.fields.forEach((field) => {
                    periodsModel.toggleFieldVisibility(field, periodsModel.currentPagePeriods.payload.some((p) => p[field.name]));
                });
                break;
            case columnDisplayOptions.all:
                for (const field of periodsModel.fields) {
                    periodsModel.toggleFieldVisibility(field, true);
                }
                model.notify();
                break;
            default:
                break;
        }
    }

    return h('.flex-row.pager-panel.items-center', [
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center.ph3',
                h('.italic', newItemsCounter(periodsModel.pagination))),

            h('button.btn.icon-only-button.m-right-15', {
                className: periodsModel.sortingRowVisible ? 'btn-primary' : 'btn-secondary',
                onclick: () => periodsModel.toggleSortingRowVisibility(),
            }, periodsModel.sortingRowVisible ? h('.sorting-20-off-white.abs-center') : h('.sorting-20-primary.abs-center')),

            h('select.select.column-options-select', {
                id: columnOptionsSelectId,
                name: columnOptionsSelectId,
                onchange: () => handleOptionChange(),
            },
            [
                h('option', { value: columnDisplayOptions.nonEmpty }, 'Non empty columns'),
                h('option', { value: columnDisplayOptions.all }, 'All columns'),
                // ToDo add customizable option => open modal here
            ], iconChevronBottom())),

    ]);
}
