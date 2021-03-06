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
import { h } from '/js/src/index.js';
import { RCT } from '../../../config.js';

const siteParamName = RCT.dataReqParams.site;
const visibleNeighbourButtonsRange = 2;
const maxVisibleButtons = 10;

export default function siteController(model, data) {
    const mapArrayToButtons = (arr) => arr.map((i) => {
        const site = i + 1;
        const url = replaceUrlParams(data.url, [[siteParamName, site]]);
        return viewButton(
            model, site, () => model.fetchedData.changeSite(site), '', url.pathname + url.search, '', '.m1', true,
        );
    });

    const sitesNumber = Math.ceil(data.totalRecordsNumber / data.rowsOnsite);
    const currentSite = Number(Object.fromEntries(data.url.searchParams.entries())[siteParamName]);
    const currentSiteIdx = currentSite - 1;

    // eslint-disable-next-line max-len
    const middleButtonsR = range(Math.max(0, currentSiteIdx - visibleNeighbourButtonsRange), Math.min(sitesNumber, currentSiteIdx + visibleNeighbourButtonsRange + 1));

    const leftButtonsR = range(0, Math.min(middleButtonsR[0], Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2)));

    // eslint-disable-next-line max-len
    const rightButtonsR = range(Math.max(middleButtonsR[middleButtonsR.length - 1] + 1, sitesNumber - Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2)), sitesNumber);

    const leftThreeDotsPresent = !(leftButtonsR[leftButtonsR.length - 1] === middleButtonsR[0] - 1 || leftButtonsR.length === 0);
    const rightThreeDotsPresent = !(rightButtonsR[0] === middleButtonsR[middleButtonsR.length - 1] + 1 || rightButtonsR.length === 0);

    // TODO add tooltips
    const siteChangingController = (onclickF, label) => h('a.site-changing-controller', { onclick: onclickF }, label);

    return [
        h('.flex-row', [
            h('.menu-title', 'rows on site:'),
            h('input', { id: 'rows-on-site-input', type: 'number', placeholder: 50, value: model.router.params['rows-on-site'] }, ''),
            h('button.btn', { onclick: () => onclickSetRowsOnSite(model) }, 'apply'),
        ]), h('.flex-row', [
            h('.menu-title', 'site:'),
            // Move to first site
            currentSite > 1 ? siteChangingController(() => model.fetchedData.changeSite(1), '<<') : ' ',
            // Move to middle of sites range [first, current]
            currentSite > 3 ? siteChangingController(() => model.fetchedData.changeSite(Math.floor(currentSite / 2)), '|') : ' ',
            // Move one site back
            currentSite > 1 ? siteChangingController(() => model.fetchedData.changeSite(currentSite - 1), '<') : ' ',

            mapArrayToButtons(leftButtonsR),
            leftThreeDotsPresent ? '...' : '',
            mapArrayToButtons(middleButtonsR),
            rightThreeDotsPresent ? '...' : '',
            mapArrayToButtons(rightButtonsR),

            // Analogically as above
            currentSite < sitesNumber ? siteChangingController(() => model.fetchedData.changeSite(currentSite + 1), '>') : ' ',
            // eslint-disable-next-line max-len
            currentSite < sitesNumber - 2 ? siteChangingController(() => model.fetchedData.changeSite(currentSite + Math.floor((sitesNumber - currentSite) / 2)), '|') : ' ',
            currentSite < sitesNumber ? siteChangingController(() => model.fetchedData.changeSite(sitesNumber), '>>') : ' ',
        ]),
    ];
}

function onclickSetRowsOnSite(model) {
    const input = document.getElementById('rows-on-site-input');
    const rowsOnSite = input.value === '' ? input.placeholder : input.value;
    if (rowsOnSite < 1 || rowsOnSite > 200) {
        alert('incorrect number of rows on site must be in range [1, 200]');
        input.value = 50;
    }
    model.fetchedData.changeRowsOnSite(rowsOnSite);
}
