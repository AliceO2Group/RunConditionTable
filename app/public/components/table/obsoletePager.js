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

const { site } = RCT.dataReqParams;

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
    const currentPageNumber = Number(Object.fromEntries(data.url.searchParams.entries())[site]);
    const columnOptionsSelectId = 'columns-option-select-id';
    const morePagesLeft = currentPageNumber > 2;
    const morePagesRight = currentPageNumber < pagesCount - 1;
    const isFirstPage = currentPageNumber === 1;
    const isLastPage = currentPageNumber === pagesCount;

    const pageButtonDisplayStyle = (targetPage) => targetPage === currentPageNumber
        ? '.btn-primary'
        : '.btn-secondary';

    const pageButton = (targetPage) => h(`button.btn${pageButtonDisplayStyle(targetPage)}.no-text-decoration`, {
        onclick: () => model.fetchedData.changePage(targetPage),
    }, targetPage);

    const pageChangingController = (targetPage, content) => h('button.btn.btn-secondary.site-changing-controller', {
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
                // Move to the first site
                !isFirstPage ? pageChangingController(1, h('.double-left-15-primary')) : ' ',
                // Move one site back
                !isFirstPage ? pageChangingController(currentPageNumber - 1, h('.back-15-primary')) : ' ',

                // Move to the middle of sites range [first, current]
                morePagesLeft
                    ? pageChangingController(
                        Math.floor(currentPageNumber / 2),
                        h('.more-15-primary'),
                    )
                    : '',

                !isFirstPage ? pageButton(currentPageNumber - 1) : '',
                pageButton(currentPageNumber),
                !isLastPage ? pageButton(currentPageNumber + 1) : '',

                // Move to the middle of sites range [current, last]
                morePagesRight
                    ? pageChangingController(
                        currentPageNumber + Math.floor((pagesCount - currentPageNumber) / 2),
                        h('.more-15-primary'),
                    )
                    : '',

                // Move one site forward
                !isLastPage
                    ? pageChangingController(
                        currentPageNumber + 1,
                        h('.forward-15-primary'),
                    )
                    : '',

                // Move to the last site
                !isLastPage
                    ? pageChangingController(
                        pagesCount,
                        h('.double-right-15-primary'),
                    )
                    : ''),
        ]),
    ];
}
