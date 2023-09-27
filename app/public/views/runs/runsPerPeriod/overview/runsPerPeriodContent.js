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
import indexChip from '../../../../components/chips/indexChip.js';
import obsoletePager from '../../../../components/table/obsoletePager.js';
import { defaultIndexString } from '../../../../utils/defaults.js';
import { anyFiltersActive } from '../../../../utils/filtering/filterUtils.js';
import pagesCellsSpecials from '../../../userView/data/pagesCellsSpecials.js';
import title from '../../../../components/table/title.js';
import header from '../table/header.js';
import row from '../table/row.js';
import filter from '../../../userView/data/table/filtering/obsoleteFilter.js';
import obsoleteActiveFilters from '../../../userView/data/table/filtering/obsoleteActiveFilters.js';
import sortingRow from '../../../userView/data/table/sortingRow.js';
import { noMatchingData, noDataFound } from '../../../../components/messagePanel/messages.js';
import noSubPageSelected from '../../../userView/data/table/noSubPageSelected.js';
import dataActionButtons, { dataActions } from '../../../../components/buttons/dataActionButtons.js';
import { RCT } from '../../../../config.js';
const pageName = RCT.pageNames.runsPerPeriod;

const applicableDataActions = {
    [dataActions.obsoleteHide]: true,
    [dataActions.reload]: true,
    [dataActions.obsoleteDownloadCSV]: true,
    [dataActions.downloadCSV]: false,
    [dataActions.copyLink]: true,
    [dataActions.obsoleteShowFilteringPanel]: true,
};

export default function runsPerPeriodContent(runsPerPeriodModel, model, runsModel, detectors, periodId, fullModel) {
    const runs = runsPerPeriodModel.allRuns[periodId].currentPageRuns.payload;
    const { navigation } = fullModel;
    const url = fullModel.router.getUrl();

    const { fields } = runsPerPeriodModel.allRuns[periodId];
    // const visibleFields = fields.filter((f) => f.marked);

    return h('.p-1rem', [
            h('.flex-wrap.justify-between.items-center',
                h('.flex-wrap.justify-between.items-center',
                    title(pageName),
                    //chips
                    ),

                dataActionButtons(model, applicableDataActions)),
            // model.showFilteringPanel ? filter(model) : '',
            // anyFiltersActive(url) ? obsoleteActiveFilters(model, url) : '',

            runs?.length > 0
                // ? visibleFields.length > 0
                    ? h('.p-top-05em',
                        h('.x-scrollable-table.border-sh',
                            // obsoletePager(model, data, false),
                            h('table.runs-table', {
                                id: `data-table-${url}`,
                            },
                            // header(runsPerPeriodModel.allRuns[periodId], pageName, runs),
                            // model.sortingRowVisible ? sortingRow(fields, runs, model) : '',
                            
                            h('tbody', { id: `table-body-${pageName}` },
                                runs.map((run) => row(
                                run, navigation, runsPerPeriodModel.allRuns[periodId],
                            ))))))
                            // tableBody(model, fields, runs, periodId, runsModel, detectors))))
                            // runs.rows.length > 15 ? obsoletePager(model, data) : ''))
                    : ''
                /*
                : anyFiltersActive(url)
                    ? noMatchingData(model, dataPointer.page)
                    : noDataFound(model),
                    */
        ]);
}
