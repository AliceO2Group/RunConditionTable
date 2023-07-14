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
import { RCT } from '../../../config.js';
import { getReadableFileSizeString } from '../../../utils/utils.js';
import actionChip from '../../../components/chips/actionChip.js';
const { dataReqParams: DRP } = RCT;
const { pageNames: PN } = RCT;

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

pagesCellsSpecials[PN.periods] = {
    name: (model, item) => [
        h('td.text-ellipsis', item.name),
        h('td',
            actionChip(
                model,
                'runs',
                (e) => model.handleClick(e),
                '',
                // eslint-disable-next-line max-len
                `/?page=${PN.runsPerPeriod}&index=${item.name}&${DRP.rowsOnSite}=50&${DRP.site}=1&sorting=-run_number`,
            ),

            actionChip(
                model,
                'data passes',
                (e) => model.handleClick(e),
                '',
                `/?page=${PN.dataPasses}&index=${item.name}&${DRP.rowsOnSite}=50&${DRP.site}=1`,
            ),

            actionChip(
                model,
                'MC',
                (e) => model.handleClick(e),
                '',
                `/?page=${PN.mc}&index=${item.name}&${DRP.rowsOnSite}=50&${DRP.site}=1`,
            )),
    ],

    energy: (model, item) =>
        `${Number(item.energy).toFixed(2)}`
    ,
};

pagesCellsSpecials[PN.dataPasses] = {
    name: (model, item) => [
        h('td.text-ellipsis', item.name),
        h('td',
            h('button.btn.chip.m1', {
                onclick: async () => {
                    const page = model.fetchedData[PN.dataPasses];
                    const [pIndex] = Object.keys(page);
                    const { url } = page[pIndex].payload;
                    const dpSearchParams = `?page=${PN.runsPerDataPass}&index=${item.name}&${DRP.rowsOnSite}=50&${DRP.site}=1`;
                    await model.fetchedData.reqForData(true, new URL(url.origin + url.pathname + dpSearchParams));

                    const [dpIndex] = Object.keys(model.fetchedData[PN.runsPerDataPass]);
                    const runNumbers = model.fetchedData[PN.runsPerDataPass][dpIndex].payload.rows.map((row) => row.run_number);

                    const search = `?page=${PN.flags}&data_pass_name=${item.name}&run_numbers=${runNumbers}&${DRP.rowsOnSite}=50&${DRP.site}=1`;
                    const flagsUrl = new URL(url.origin + url.pathname + search);
                    await model.fetchedData.reqForData(true, flagsUrl);
                    model.router.go(`/?page=${PN.runsPerDataPass}&index=${item.name}&${DRP.rowsOnSite}=50&${DRP.site}=1&sorting=-run_number`);
                },
            }, 'runs'),
            actionChip(
                model,
                'anchorage',
                (e) => model.handleClick(e),
                '',
                // eslint-disable-next-line max-len
                `/?page=${PN.anchoragePerDatapass}&index=${item.name}&${DRP.rowsOnSite}=50&${DRP.site}=1&sorting=-name`,
            )),
    ],
    size: (model, item) => getReadableFileSizeString(Number(item.size)),
};
pagesCellsSpecials[PN.mc] = {
    name: (model, item) => [
        h('td.text-ellipsis', item.name),
        h('td',
            actionChip(
                model,
                'anchored',
                (e) => model.handleClick(e),
                '',
                // eslint-disable-next-line max-len
                `/?page=${PN.anchoredPerMC}&index=${item.name}&${DRP.rowsOnSite}=50&${DRP.site}=1&sorting=-name`,
            )),
    ],
};

const dateFormatter = (sec) => {
    const cestOffset = 2 * 60 * 60 * 1000;
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const d = new Date(Number(sec) + cestOffset + localOffset);
    const dateString = d.toLocaleDateString();
    const timeString = d.toLocaleTimeString();
    return h('', h('.skinny', dateString), timeString);
};

pagesCellsSpecials[PN.runsPerPeriod] = {
    run_number: (model, item) => h('.thick', item.run_number),
    time_start: (model, item) => dateFormatter(item.time_start),
    time_end: (model, item) => dateFormatter(item.time_end),
    time_trg_start: (model, item) => dateFormatter(item.time_trg_start),
    time_trg_end: (model, item) => dateFormatter(item.time_trg_end),
};

pagesCellsSpecials[PN.flags] = {
    time_start: (item) => dateFormatter(item.time_start),
    time_end: (item) => dateFormatter(item.time_end),
    ver_time: (item) => item.ver_time.isEmpty
        ? 'unverified'
        : item.ver_time.map((e) => {
            if (!e) {
                return 'unverified';
            }
            const date = new Date(e);
            return dateFormatter(date.getTime());
        }),
};

pagesCellsSpecials[PN.runsPerDataPass] = pagesCellsSpecials[PN.runsPerPeriod];
pagesCellsSpecials[PN.anchoredPerMC] = pagesCellsSpecials[PN.dataPasses];
pagesCellsSpecials[PN.anchoragePerDatapass] = pagesCellsSpecials[PN.mc];

// Checking correctness of configuration
for (const p in pagesCellsSpecials) {
    if (pagesCellsSpecials[p]) {
        if (! PN[p]) {
            throw Error('incorrect configuration');
        }
    }
}

export default pagesCellsSpecials;