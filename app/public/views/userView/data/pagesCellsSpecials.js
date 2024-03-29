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
import { getReadableFileSizeString, dateFormatter } from '../../../utils/dataProcessing/dataProcessingUtils.js';
import linkChip from '../../../components/chips/linkChip.js';
import { buildHref } from '../../../utils/url/urlUtils.js';
const { dataReqParams: DRP, pageNames: PN, outerServices } = RCT;

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
 *              `/?page=runsPerPeriod&index=${item.period}&period=${item.period}&itemsPerPage=50&page-number=1`);
 *      },
 *  },
 *  // ...,
 *}
 *
 * means that in page main in column period cells will be buttons which will redirect
 * to page runs with fetched data from table runs related to chosen period.
 */

const pagesCellsSpecials = {};

pagesCellsSpecials[PN.dataPasses] = {
    name: (model, runs, item) => [
        h('td.text-ellipsis', item.name),
        h('td',
            h('button.btn.chip.m1', {
                onclick: async () => {
                    await runs.fetchRunsPerDataPass(item.name);
                    model.router.go(
                        buildHref({
                            page: PN.runsPerDataPass,
                            index: item.name,
                            [DRP.itemsPerPage]: model.parent.userPreferences.itemsPerPage,
                            [DRP.pageNumber]: 1,
                            sorting: '-run_number',
                        }),
                    );
                },
            }, 'runs'),
            linkChip(
                model.navigation,
                'anchorage',
                buildHref({
                    page: PN.anchoragePerDatapass,
                    index: item.name,
                    [DRP.itemsPerPage]: model.parent.userPreferences.itemsPerPage,
                    [DRP.pageNumber]: 1,
                    sorting: '-name',
                }),
            )),
    ],
    size: (_, _runs, item) => getReadableFileSizeString(Number(item.size)),
};
pagesCellsSpecials[PN.mc] = {
    name: (model, item) => [
        h('td.text-ellipsis', item.name),
        h('td',
            linkChip(
                model.navigation,
                'anchored',
                buildHref({
                    page: PN.anchoredPerMC,
                    index: item.name,
                    [DRP.itemsPerPage]: model.parent.userPreferences.itemsPerPage,
                    [DRP.pageNumber]: 1,
                    sorting: '-name',
                }),
            )),
    ],
};

pagesCellsSpecials[PN.runsPerPeriod] = {
    run_number: (_, item) => h('.thick', item.run_number),
    time_o2_start: (_, item) => dateFormatter(item.time_o2_start),
    time_o2_end: (_, item) => dateFormatter(item.time_o2_end),
    time_trg_start: (_, item) => dateFormatter(item.time_trg_start),
    time_trg_end: (_, item) => dateFormatter(item.time_trg_end),
    fill_number: (_, item) => h('a', {
        href: `${outerServices.bookkeeping.lhcFills.url}&${outerServices.bookkeeping.lhcFills.params.fillNumber}=${item.fill_number}`,
        target: '_blank',
    }, item.fill_number, h('.external-link-15-blue')),
};

pagesCellsSpecials[PN.flags] = {
    time_start: (item) => dateFormatter(item.time_start),
    time_end: (item) => dateFormatter(item.time_end),
    by: (item) => ! item.verifications?.length
        ? 'unverified'
        : item.verifications.map(({ by: verifier }) => h('.verification-border', h('', verifier, h('.skinny.hidden', '.')))),
    verification_time: (item) => ! item.verifications?.length
        ? 'unverified'
        : item.verifications.map(({ verification_time }) =>
            h('.verification-border', dateFormatter(new Date(verification_time).getTime()))),
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
