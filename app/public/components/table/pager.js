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

const columnDisplayOptions = {
    nonEmpty: 'nonEmty',
    all: 'all',
};

export default function pager(periodsModel, model) {
    const columnDisplayOptionsSelectId = 'columns-option-select-id';
    const currentSite = periodsModel.pagination.currentPage;
    const sitesNumber = periodsModel.pagination.pagesCount;

    const pageButton = (targetSite) => h(`button.btn${targetSite === currentSite ? '.btn-primary' : '.btn-secondary'}.no-text-decoration`, {
        onclick: () => periodsModel.pagination.goToPage(targetSite),
    }, targetSite);

    const siteChangingController = (targetSite, content) => h('button.btn.btn-secondary.site-changing-controller', {
        onclick: () => periodsModel.pagination.goToPage(targetSite),
    }, content);

    const moreSitesLeft = currentSite > 2;
    const moreSitesRight = currentSite < sitesNumber - 1;

    function handleColumnOptionDisplayChange() {
        const columnOptionsSelect = document.getElementById(columnDisplayOptionsSelectId);
        const selectedOption = columnOptionsSelect.options[columnOptionsSelect.selectedIndex].value;
        switch (selectedOption) {
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
                h('.italic', itemsCounter(periodsModel.pagination))),

            h('button.btn.icon-only-button.m-right-15', {
                className: periodsModel.sortingRowVisible ? 'btn-primary' : 'btn-secondary',
                onclick: () => periodsModel.toggleSortingRowVisibility(),
            }, periodsModel.sortingRowVisible ? h('.sorting-20-off-white.abs-center') : h('.sorting-20-primary.abs-center')),

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

        h('.flex.m-right-0-3-rem',
            // Move to the first site
            currentSite > 1 ? siteChangingController(1, h('.double-left-15-primary')) : '',
            // Move one site back
            currentSite > 1 ? siteChangingController(currentSite - 1, h('.back-15-primary')) : '',

            // Move to the middle of sites range [first, current]
            moreSitesLeft
                ? siteChangingController(
                    Math.floor(currentSite / 2),
                    h('.more-15-primary'),
                )
                : '',

            currentSite > 1 ? pageButton(currentSite - 1) : '',
            pageButton(currentSite),
            currentSite < sitesNumber ? pageButton(currentSite + 1) : '',

            // Move to the middle of sites range [current, last]
            moreSitesRight
                ? siteChangingController(
                    currentSite + Math.floor((sitesNumber - currentSite) / 2),
                    h('.more-15-primary'),
                )
                : '',

            // Move one site forward
            currentSite < sitesNumber
                ? siteChangingController(
                    currentSite + 1,
                    h('.forward-15-primary'),
                )
                : '',

            // Move to the last site
            currentSite < sitesNumber
                ? siteChangingController(
                    sitesNumber,
                    h('.double-right-15-primary'),
                )
                : ''),

    ]);
}
