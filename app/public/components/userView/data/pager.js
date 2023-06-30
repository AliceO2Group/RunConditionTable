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

import viewButton from '../../common/viewButton.js';
import { range, replaceUrlParams } from '../../../utils/utils.js';
import { h, iconMediaSkipBackward, iconCaretLeft, iconChevronBottom, iconCaretRight, iconMediaSkipForward } from '/js/src/index.js';
import { RCT } from '../../../config.js';
import itemsCounter from './table/items-counter.js';

const siteParamName = RCT.dataReqParams.site;
const visibleNeighbourButtonsRange = 2;
const maxVisibleButtons = 10;

export default function pager(model, data, pagerOnly = true) {
    const mapArrayToButtons = (arr) => arr.map((i) => {
        const site = i + 1;
        const url = replaceUrlParams(data.url, [[siteParamName, site]]);

        return viewButton(
            model,
            site,
            () => model.fetchedData.changePage(site),
            '',
            url.pathname + url.search,
            `.btn.btn-secondary${currentSite.toString() === site.toString() ? '.selected' : ''}`,
            '',
            true,
        );
    });

    const sitesNumber = Math.ceil(data.totalRecordsNumber / data.rowsOnSite);
    const currentSite = Number(Object.fromEntries(data.url.searchParams.entries())[siteParamName]);
    const currentSiteIdx = currentSite - 1;

    const middleButtonsR = range(
        Math.max(0, currentSiteIdx - visibleNeighbourButtonsRange),
        Math.min(sitesNumber, currentSiteIdx + visibleNeighbourButtonsRange + 1),
    );

    const leftButtonsR = range(
        0,
        Math.min(
            middleButtonsR[0],
            Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2),
        ),
    );

    const rightButtonsR = range(
        Math.max(
            middleButtonsR[middleButtonsR.length - 1] + 1,
            sitesNumber - Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2),
        ),
        sitesNumber,
    );

    const leftThreeDotsPresent = !(leftButtonsR[leftButtonsR.length - 1] === middleButtonsR[0] - 1 || leftButtonsR.length === 0);
    const rightThreeDotsPresent = !(rightButtonsR[0] === middleButtonsR[middleButtonsR.length - 1] + 1 || rightButtonsR.length === 0);

    const siteChangingController = (onclickF, label) => h('a.site-changing-controller', { onclick: onclickF }, label);

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
                            h('.italic', itemsCounter(data)))),

                    h('button.btn.icon-only-button.btn-secondary', {
                        onclick: () => {
                            const sortingRow = document.getElementById('sortingRow');
                            if (sortingRow.style.display === 'none') {
                                sortingRow.style.display = 'table-header-group';
                            } else {
                                sortingRow.style.display = 'none';
                            }
                        },
                    }, h('.sort-20')),

                    h('.flex-wrap.justify-between.items-center',

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
                // Move to first site
                currentSite > 1 ? siteChangingController(() => model.fetchedData.changePage(1), iconMediaSkipBackward()) : ' ',
                // Move to middle of sites range [first, current]
                currentSite > 3
                    ? siteChangingController(() => model.fetchedData.changePage(Math.floor(currentSite / 2)), iconChevronBottom())
                    : ' ',
                // Move one site back
                currentSite > 1 ? siteChangingController(() => model.fetchedData.changePage(currentSite - 1), iconCaretLeft()) : ' ',

                mapArrayToButtons(leftButtonsR),
                leftThreeDotsPresent ? h('.ellipsis-20') : '',
                mapArrayToButtons(middleButtonsR),
                rightThreeDotsPresent ? '...' : '',
                mapArrayToButtons(rightButtonsR),

                // Analogically as above
                currentSite < sitesNumber
                    ? siteChangingController(
                        () => model.fetchedData.changePage(currentSite + 1),
                        iconCaretRight(),
                    )
                    : ' ',

                currentSite < sitesNumber - 2
                    ? siteChangingController(
                        () => model.fetchedData.changePage(currentSite + Math.floor((sitesNumber - currentSite) / 2)),
                        iconChevronBottom(),
                    )
                    : ' ',

                currentSite < sitesNumber
                    ? siteChangingController(
                        () => model.fetchedData.changePage(sitesNumber),
                        iconMediaSkipForward(),
                    )
                    : ' '),
        ]),
    ];
}
