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
    const sitesNumber = Math.ceil(data.totalRecordsNumber / data.itemsPerPage);
    const currentSite = Number(Object.fromEntries(data.url.searchParams.entries())[site]);
    const columnOptionsSelectId = 'columns-option-select-id';

    const pageButton = (targetSite) => h(`button.btn${targetSite === currentSite ? '.btn-primary' : '.btn-secondary'}.no-text-decoration`, {
        onclick: () => model.fetchedData.changePage(targetSite),
    }, targetSite);

    const siteChangingController = (targetSite, content) => h('button.btn.btn-secondary.site-changing-controller', {
        onclick: () => model.fetchedData.changePage(targetSite),
    }, content);

    const moreSitesLeft = currentSite > 2;
    const moreSitesRight = currentSite < sitesNumber - 1;

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
                currentSite > 1 ? siteChangingController(1, h('.double-left-15-primary')) : ' ',
                // Move one site back
                currentSite > 1 ? siteChangingController(currentSite - 1, h('.back-15-primary')) : ' ',

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
        ]),
    ];
}
