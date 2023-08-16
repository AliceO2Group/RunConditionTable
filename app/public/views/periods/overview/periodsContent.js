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
import { RCT } from '../../../config.js';
import title from '../../../components/table/title.js';
import dataActionButtons, { dataActions } from '../../../components/buttons/dataActionButtons.js';
import filter from '../../userView/data/table/filtering/filter.js';
import { anyFiltersActive } from '../../../utils/filtering/filterUtils.js';
import activeFilters from '../../userView/data/table/filtering/activeFilters.js';
import { noDataFound, noMatchingData } from '../../../components/messagePanel/messages.js';
import periodsTableHeader from '../table/periodsTableHeader.js';
import periodsTableRow from '../table/periodsTableRow.js';
import tableManager from '../../../components/table/tableManager.js';
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

export default function periodsContent(periodsModel, periods, model) {
    const { dataAccess } = model;

    const url = model.router.getUrl();

    return h('.p-1rem',
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                title(pageName)),
            dataActionButtons(dataAccess, applicableDataActions)),

        model.showFilteringPanel ? filter(dataAccess) : '',
        anyFiltersActive(url) ? activeFilters(dataAccess, url) : '',

        periods.length > 0
            ? periodsModel.visibleFields.length > 0
                ? h('.p-top-05em',
                    h('.x-scrollable-table.border-sh',
                        tableManager(periodsModel, model),
                        h(`table.${pageName}-table`, {
                            id: `data-table-${pageName}`,
                        },
                        periodsTableHeader(pageName, periodsModel.visibleFields, periods, model),
                        h('tbody', { id: `table-body-${pageName}` },
                            periods.map((period) => periodsTableRow(
                                period, periodsModel.visibleFields, dataAccess, periodsModel,
                            ))))))
                : ''
            : anyFiltersActive(url)
                ? noMatchingData(dataAccess, pageName)
                : noDataFound(dataAccess));
}
