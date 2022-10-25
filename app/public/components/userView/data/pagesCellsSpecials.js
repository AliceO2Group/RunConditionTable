/* eslint-disable multiline-comment-style */
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
import { h } from '/js/src/index.js';
import viewButton from '../../common/viewButton.js';
import { RCT } from '../../../config.js';
const { dataReqParams } = RCT;
const { pagesNames } = RCT;
import { getReadableFileSizeString } from '../../../utils/utils.js';

/**
 * Configuration what buttons at which cells and which pages are supposed
 *  to appear is done using object below which contains
 *  appropriate lambda expression generating button with defined behaviour
 *  regarding <model, item(particular row given as object), name(of column)>
 *  e.g:
 *  @example
 *
 *const pagesCellsButtons = {
 *  periods: {
 *      period: (model, item, name) => {
 *          return viewButton(model, item.period, (e) =>
 *                  handleClick(model, e), '',
 *                  TODO : this pattern is deprecated
 *              `/?page=runsPerPeriod&index=${item.period}&period=${item.period}&rowsOnSite=50&site=1`);
 *      },
 *  },
 *  // ...,
 *}
 *
 * means that in page main in column period cells will be buttons which will redirect
 * to page runs with fetched data from table runs related to chosen period.
 */

const pagesCellsSpecials = {};

pagesCellsSpecials[pagesNames.periods] = {
    name: (model, item) => [
        item.name,
        '  ',
        viewButton(
            model,
            'runs',
            (e) => model.handleClick(e),
            '',
            // eslint-disable-next-line max-len
            `/?page=${pagesNames.runsPerPeriod}&index=${item.name}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-run_number`,
        ),

        viewButton(
            model,
            'data passes',
            (e) => model.handleClick(e),
            '',
            `/?page=${pagesNames.dataPasses}&index=${item.name}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`,
        ),

        viewButton(
            model,
            'MC',
            (e) => model.handleClick(e),
            '',
            `/?page=${pagesNames.mc}&index=${item.name}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`,
        ),
    ],

    energy: (model, item) => {
        const energies = item.energy.split(/,/).map((v) => Number(v.trim()));
        const avg = energies.reduce((acc, c, _, __) => acc + c, 0) / (energies.length || 1);
        return `${Number(avg).toFixed(2)}`;
        // TODO maybe charts
    },
};

pagesCellsSpecials[pagesNames.dataPasses] = {
    name: (model, item) => [
        item.name,
        '  ',
        viewButton(
            model,
            'runs',
            (e) => model.handleClick(e),
            '',
            // eslint-disable-next-line max-len
            `/?page=${pagesNames.runsPerDataPass}&index=${item.name}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-run_number`,
        ),
        viewButton(
            model,
            'anchorage',
            (e) => model.handleClick(e),
            '',
            // eslint-disable-next-line max-len
            `/?page=${pagesNames.anchoragePerDatapass}&index=${item.name}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-name`,
        ),
    ],
    size: (model, item) => getReadableFileSizeString(Number(item.size)),
};
pagesCellsSpecials[pagesNames.mc] = {
    name: (model, item) => [
        item.name,
        '  ',
        viewButton(
            model,
            'anchored',
            (e) => model.handleClick(e),
            '',
            // eslint-disable-next-line max-len
            `/?page=${pagesNames.anchoredPerMC}&index=${item.name}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-name`,
        ),
    ],
};

const dateFormatter = (sec) => {
    const cestOffset = 2 * 60 * 60 * 1000;
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const d = new Date(Number(sec) + cestOffset + localOffset);
    return d.toLocaleString();
};

pagesCellsSpecials[pagesNames.runsPerPeriod] = {
    run_number: (model, item) => h('.thick', item.run_number),
    time_start: (mode, item) => dateFormatter(item.time_start),
    time_end: (mode, item) => dateFormatter(item.time_end),
    time_trg_start: (mode, item) => dateFormatter(item.time_trg_start),
    time_trg_end: (mode, item) => dateFormatter(item.time_trg_end),
};

pagesCellsSpecials[pagesNames.flags] = {};
pagesCellsSpecials[pagesNames.runsPerDataPass] = pagesCellsSpecials[pagesNames.runsPerPeriod];
pagesCellsSpecials[pagesNames.anchoredPerMC] = pagesCellsSpecials[pagesNames.dataPasses];
pagesCellsSpecials[pagesNames.anchoragePerDatapass] = pagesCellsSpecials[pagesNames.mc];

// Checking correctness of configuration
for (const p in pagesCellsSpecials) {
    if (pagesCellsSpecials[p]) {
        if (! pagesNames[p]) {
            throw Error('incorrect configuration');
        }
    }
}

export default pagesCellsSpecials;