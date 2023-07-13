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

import viewButton from '../../../components/common/viewButton.js';
import { replaceUrlParams } from '../../../utils/utils.js';
import { h, iconChevronBottom } from '/js/src/index.js';
import itemsCounter from './table/items-counter.js';
import { RCT } from '../../../config.js';

const { site } = RCT.dataReqParams;

export default function pager(model, data, pagerOnly = true) {
    const sitesNumber = Math.ceil(data.totalRecordsNumber / data.rowsOnSite);
    const currentSite = Number(Object.fromEntries(data.url.searchParams.entries())[site]);

    const pageButton = (targetSite) => {
        const url = replaceUrlParams(data.url, [[site, targetSite]]);
        return viewButton(
            model,
            targetSite,
            () => model.fetchedData.changePage(targetSite),
            '',
            url.pathname + url.search,
            `.btn${targetSite === currentSite ? '.btn-primary' : '.btn-secondary'}`,
            '',
            true,
        );
    };

    const siteChangingController = (targetSite, content) => h('a.btn.btn-secondary.site-changing-controller', {
        onclick: () => model.fetchedData.changePage(targetSite),
    }, content);

    const moreSitesLeft = currentSite > 2;
    const moreSitesRight = currentSite < sitesNumber - 1;

    function handleOptionChange() {
        const columnsOptionsSelect = document.getElementById('columns-options');
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
            case '2':
                /* Customize */
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
                            h('.italic', itemsCounter(data))),

                        h('button.btn.icon-only-button.m-right-15', {
                            className: model.sortingRowVisible ? 'btn-primary' : 'btn-secondary',
                            onclick: () => model.changeSortingRowVisibility(),
                        }, model.sortingRowVisible ? h('.sorting-20-off-white.abs-center') : h('.sorting-20-primary.abs-center')),

                        h('select.select.show-columns', {
                            id: 'columns-options',
                            name: 'showOptions',
                            onchange: () => handleOptionChange(),
                        },
                        [
                            h('option', { value: 0 }, 'Non empty columns'),
                            h('option', { value: 1 }, 'All columns'),
                            h('option', { value: 2 }, 'Customize'),
                        ], iconChevronBottom())),
                ],

            h('.flex.pager-buttons',
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
