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

const { pageNames } = RCT;

const applicableDataActions = {
    [dataActions.obsoleteHide]: true,
    [dataActions.reload]: true,
    [dataActions.obsoleteDownloadCSV]: true,
    [dataActions.downloadCSV]: false,
    [dataActions.copyLink]: true,
    [dataActions.obsoleteShowFilteringPanel]: true,
};

export default function content(model, runs, detectors) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;
    const page = model.fetchedData[dataPointer.page];
    const { url } = page[dataPointer.index].payload;

    const chips = model.getSubPages(dataPointer.page)
        .filter((index) => index !== defaultIndexString)
        .map((index) => indexChip(model, dataPointer.page, index));

    const cellsSpecials = pagesCellsSpecials[dataPointer.page];

    const { fields } = data;
    const visibleFields = fields.filter((f) => f.marked);

    return dataPointer.index === defaultIndexString
        ? noSubPageSelected(model)
        : h('.p-1rem', [
            h('.flex-wrap.justify-between.items-center',
                h('.flex-wrap.justify-between.items-center',
                    title(pageNames.runsPerDataPass),
                    chips),

                dataActionButtons(model, applicableDataActions)),
            model.showFilteringPanel ? filter(model) : '',
            anyFiltersActive(url) ? obsoleteActiveFilters(model, url) : '',

            data.rows?.length > 0
                ? visibleFields.length > 0
                    ? h('.p-top-05em',
                        h('.x-scrollable-table.border-sh',
                            obsoletePager(model, data, false),
                            h('table.runs-table', {
                                id: `data-table-${data.url}`,
                            },
                            header(visibleFields, data, model),
                            model.sortingRowVisible ? sortingRow(visibleFields, data, model) : '',
                            tableBody(model, visibleFields, data, cellsSpecials, dataPointer.index, runs, detectors)),
                            data.rows.length > 15 ? obsoletePager(model, data) : ''))
                    : ''
                : anyFiltersActive(url)
                    ? noMatchingData(model, dataPointer.page)
                    : noDataFound(model),
        ]);
}

function tableBody(
    model, visibleFields, data, cellsSpecials, index, runs, detectors,
) {
    return h('tbody', { id: `table-body-${data.url}` },
        data.rows.map((item) => row(
            model, visibleFields, data, item, cellsSpecials, index, runs, detectors,
        )));
}
