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
import obsoleteItemsCounter from '../../views/userView/data/table/obsoleteItemsCounter.js';
import { RCT } from '../../config.js';
import { pageButtonStyle, pagerButtonConditions } from './pagerUtils.js';

const { pageNumber } = RCT.dataReqParams;

/**
 * Uses obsolete model.
 * @deprecated
 * @param {DataAccessModel} model dataAccessModel
 * @param {*} data data
 * @param {boolean} pagerOnly indicates whether the component should display
 *        only the pager or sorting row and column display controller as well
 * @returns {obsoletePager} row with pager and table display properties controllers
 */
export default function obsoletePager(model, data, pagerOnly = true) {
    const pagesCount = Math.ceil(data.totalRecordsNumber / data.itemsPerPage);
    const currentPageNumber = Number(Object.fromEntries(data.url.searchParams.entries())[pageNumber]);
    const columnOptionsSelectId = 'columns-option-select-id';

    const buttonConditions = pagerButtonConditions(currentPageNumber, pagesCount);

    const pageButton = (targetPage) => h(`button.btn${pageButtonStyle(targetPage, currentPageNumber)}.no-text-decoration`, {
        onclick: () => model.fetchedData.changePage(targetPage),
    }, targetPage);

    const pageChangingController = (targetPage, content) => h('button.btn.btn-secondary.page-changing-controller', {
        onclick: () => model.fetchedData.changePage(targetPage),
    }, content);

    function handleOptionChange() {
        const columnsOptionsSelect = document.getElementById(columnOptionsSelectId);
        const selectedValue = columnsOptionsSelect.options[columnsOptionsSelect.selectedIndex].value;
        switch (selectedValue) {
            case '0':
                /* Show non empty columns */
                data.fields.forEach((f) => {
                    model.fetchedData.changeItemStatus(
                        f,
                        data.rows.some((r) => r[f.name]),
                    );
                    model.notify();
                });
                break;
            case '1':
                /* Show all columns */
                for (const field of data.fields) {
                    field.marked = true;
                }
                model.notify();
                break;
            default:
                break;
        }
    }

    return [
        h('.flex-row.pager-panel.items-center', [
            pagerOnly
                ? ''
                : [
                    h('.flex-wrap.justify-between.items-center',
                        h('.flex-wrap.justify-between.items-center.ph3',
                            h('.italic', obsoleteItemsCounter(data))),

                        h('button.btn.icon-only-button.m-right-15', {
                            className: model.sortingRowVisible ? 'btn-primary' : 'btn-secondary',
                            onclick: () => model.changeSortingRowVisibility(),
                        }, model.sortingRowVisible ? h('.sorting-20-off-white.abs-center') : h('.sorting-20-primary.abs-center')),

                        h('select.select.column-display-options-select', {
                            id: columnOptionsSelectId,
                            name: columnOptionsSelectId,
                            onchange: () => handleOptionChange(),
                        },
                        [
                            h('option', { value: 0 }, 'Non empty columns'),
                            h('option', { value: 1 }, 'All columns'),
                        ], iconChevronBottom())),
                ],

            h('.flex.m-right-0-3-rem',
                buttonConditions.goToFirstPage ? pageChangingController(1, h('.double-left-15-primary')) : '',
                buttonConditions.goOnePageBack ? pageChangingController(currentPageNumber - 1, h('.back-15-primary')) : '',
                buttonConditions.goMiddleBack
                    ? pageChangingController(
                        Math.floor(currentPageNumber / 2),
                        h('.more-15-primary'),
                    )
                    : '',

                buttonConditions.goOnePageBack ? pageButton(currentPageNumber - 1) : '',
                pageButton(currentPageNumber),
                buttonConditions.goOnePageForward ? pageButton(currentPageNumber + 1) : '',

                buttonConditions.goMiddleForward
                    ? pageChangingController(
                        currentPageNumber + Math.floor((pagesCount - currentPageNumber) / 2),
                        h('.more-15-primary'),
                    )
                    : '',

                buttonConditions.goOnePageForward
                    ? pageChangingController(
                        currentPageNumber + 1,
                        h('.forward-15-primary'),
                    )
                    : '',

                buttonConditions.goToLastPage
                    ? pageChangingController(
                        pagesCount,
                        h('.double-right-15-primary'),
                    )
                    : ''),
        ]),
    ];
}
