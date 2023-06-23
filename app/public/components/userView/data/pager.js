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

const siteParamName = RCT.dataReqParams.site;
const visibleNeighbourButtonsRange = 2;
const maxVisibleButtons = 10;

export default function pager(model, data, scid) {
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

    const firstRowIdx = (currentSite - 1) * data.rowsOnSite + 1;
    const lastRowIdx = currentSite * data.rowsOnSite > data.totalRecordsNumber
        ? data.totalRecordsNumber
        : currentSite * data.rowsOnSite;

    const siteChangingController = (onclickF, label) => h('a.site-changing-controller', { onclick: onclickF }, label);

    return [
        h('.flex-row.pager-panel', [
            h('select.select', { id: 'showOptions', name: 'showOptions' },
                [
                    h('option', 'All columns'),
                    h('option', 'Non empty columns'),
                    h('option', 'Customize'),
                ], iconChevronBottom()),

            h('select.select', { id: 'showOptions', name: 'showOptions' },
                [
                    h('option', 'All columns'),
                    h('option', 'Non empty columns'),
                    h('option', 'Customize'),
                ], iconChevronBottom()),

            /*
             *H('.flex',
             *    h('input.pager.p2', {
             *        id: `rows-on-site-input-${scid}`,
             *        type: 'number',
             *        placeholder: 50,
             *        value: model.router.params['rows-on-site'],
             *    }, ''),
             *    h('.menu-title', 'per page'),
             *    h('button.btn.m1', { onclick: () => onclickSetRowsOnSite(model, scid) }, 'apply')),
             */

            h('.flex.pager-buttons',
                // Move to first site
                /*
                currentSite > 1 ?*/
                siteChangingController(() => model.fetchedData.changePage(1), iconMediaSkipBackward()), // : ' ',
                // Move to middle of sites range [first, current]
                currentSite > 3
                    ? siteChangingController(() => model.fetchedData.changePage(Math.floor(currentSite / 2)), iconChevronBottom())
                    : ' ',
                // Move one site back
                /*
                currentSite > 1 ? */
                siteChangingController(() => model.fetchedData.changePage(currentSite - 1), iconCaretLeft()), // : ' ',

                mapArrayToButtons(leftButtonsR),
                leftThreeDotsPresent ? h('.ellipsis') : '',
                mapArrayToButtons(middleButtonsR),
                rightThreeDotsPresent ? '...' : '',
                mapArrayToButtons(rightButtonsR),

                // Analogically as above
                /*
                currentSite < sitesNumber
                    ?*/ siteChangingController(
                        () => model.fetchedData.changePage(currentSite + 1),
                        iconCaretRight(),
                    ),
                //    : ' ',

                /*currentSite < sitesNumber - 2
                    ?*/ siteChangingController(
                        () => model.fetchedData.changePage(currentSite + Math.floor((sitesNumber - currentSite) / 2)),
                        iconChevronBottom(),
                    ),
                    //: ' ',
                currentSite < sitesNumber
                    ? siteChangingController(
                        () => model.fetchedData.changePage(sitesNumber),
                        iconMediaSkipForward(),
                    )
                    : ' '),
        ]),
    ];
}

function onclickSetRowsOnSite(model, scid) {
    const input = document.getElementById(`rows-on-site-input-${scid}`);
    let rowsOnSite = input.value === '' ? input.placeholder : input.value;
    if (rowsOnSite < 1 || rowsOnSite > 200) {
        alert('incorrect number of rows on page: must be in range of [1, 200]');
        input.value = 50;
        rowsOnSite = 50;
    }
    model.fetchedData.changeRowsOnSite(rowsOnSite);
}
