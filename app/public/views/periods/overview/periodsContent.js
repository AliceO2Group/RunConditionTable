/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { h } from '/js/src/index.js';
// Import pagesCellsSpecials from '../../userView/data/pagesCellsSpecials.js';
import { RCT } from '../../../config.js';
import title from '../../../components/table/title.js';
import dataActionButtons, { dataActions } from '../../../components/buttons/dataActionButtons.js';
import filter from '../../userView/data/table/filtering/filter.js';
import { anyFiltersActive } from '../../../utils/filtering/filterUtils.js';
import activeFilters from '../../userView/data/table/filtering/activeFilters.js';
const pageName = RCT.pageNames.periods;

/**
 * Build components in case of runs retrieval success
 * @param {Model} model model to access global functions
 * @param {RemoteData<Run[]>} runs list of runs retrieved from server
 * @return {vnode[]} Returns a vnode with the table containing the runs
 */

const applicableDataActions = {
    [dataActions.hide]: true,
    [dataActions.reload]: true,
    [dataActions.downloadCSV]: true,
    [dataActions.copyLink]: true,
    [dataActions.showFilteringPanel]: true,
};

export default function periodsContent(periods, model) {
    const table = (periods) => periods.map((period) => h('', period.id));

    // Const cellsSpecials = pagesCellsSpecials[pageName];
    const url = model.router.getUrl();

    return h('.p-1rem',
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                title(pageName)),
            dataActionButtons(model, applicableDataActions)),

        model.showFilteringPanel ? filter(model) : '',
        anyFiltersActive(url) ? activeFilters(model, url) : '',

        // Periods.length > 0
        table(periods));

    /*
     *Return h('.p-1rem', [
     *    h('.flex-wrap.justify-between.items-center',
     *        h('.flex-wrap.justify-between.items-center',
     *            title(dataPointer.page)),
     *
     *        dataActionButtons(model, applicableDataActions)),
     *    model.showFilteringPanel ? filter(model) : '',
     *    anyFiltersActive(url) ? activeFilters(model, url) : '',
     *
     *    data.rows?.length > 0
     *        ? visibleFields.length > 0
     *            ? h('.p-top-05em',
     *                h('.x-scrollable-table.border-sh',
     *                    pager(model, data, false),
     *                    h(`table.${dataPointer.page}-table`, {
     *                        id: `data-table-${data.url}`,
     *                    },
     *                    tableHeader(visibleFields, data, model),
     *                    model.sortingRowVisible ? sortingRow(visibleFields, data, model) : '',
     *                    tableBody(model, visibleFields, data, cellsSpecials, runs)),
     *                    data.rows.length > 15 ? pager(model, data) : ''))
     *            : ''
     *        : anyFiltersActive(url)
     *            ? noMatchingData(model, dataPointer.page)
     *            : noDataFound(model),
     *]);
     */
}
