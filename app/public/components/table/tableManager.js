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
import itemsCounter from './itemsCounter.js';
import pageSelector from './pageSelector.js';

const columnDisplayOptions = {
    nonEmpty: 'nonEmty',
    all: 'all',
};

export default function tableManager(dataModel, model) {
    const columnDisplayOptionsSelectId = 'columns-option-select-id';

    function handleColumnOptionDisplayChange() {
        const columnOptionsSelect = document.getElementById(columnDisplayOptionsSelectId);
        const selectedOption = columnOptionsSelect.options[columnOptionsSelect.selectedIndex].value;
        switch (selectedOption) {
            case columnDisplayOptions.nonEmpty:
                dataModel.fields.forEach((field) => {
                    dataModel.toggleFieldVisibility(field, dataModel.currentPageData.payload.some((p) => p[field.name]));
                });
                break;
            case columnDisplayOptions.all:
                for (const field of dataModel.fields) {
                    dataModel.toggleFieldVisibility(field, true);
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
                h('.italic', itemsCounter(dataModel.pagination))),

            h('button.btn.icon-only-button.m-right-15', {
                className: dataModel.sortingRowVisible ? 'btn-primary' : 'btn-secondary',
                onclick: () => dataModel.toggleSortingRowVisibility(),
            }, dataModel.sortingRowVisible ? h('.sorting-20-off-white.abs-center') : h('.sorting-20-primary.abs-center')),

            h('select.select.column-display-options-select', {
                id: columnDisplayOptionsSelectId,
                name: columnDisplayOptionsSelectId,
                onchange: () => handleColumnOptionDisplayChange(),
            },
            [
                h('option', { value: columnDisplayOptions.nonEmpty }, 'Non empty columns'),
                h('option', { value: columnDisplayOptions.all }, 'All columns'),
                // ToDo add customizable option => open modal here
            ], iconChevronBottom())),

        pageSelector(
            dataModel.pagination.currentPage,
            dataModel.pagination.pagesCount,
            (page) => {
                dataModel.pagination.currentPage = page;
            },
        ),

    ]);
}
