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
import tableHeader from './header.js';
import row from './row.js';
import pagesCellsSpecials from '../pagesCellsSpecials.js';
import pager from '../../../../components/table/pager.js';

import filter from './filtering/filter.js';
import activeFilters from './filtering/activeFilters.js';
import { noDataFound, noMatchingData } from '../../../../components/messagePanel/messages.js';

import sortingRow from './sortingRow.js';
import indexChip from '../../../../components/chips/indexChip.js';
import { defaultIndexString } from '../../../../utils/defaults.js';
import noSubPageSelected from './noSubPageSelected.js';
import title from '../../../../components/table/title.js';
import { anyFiltersActive } from '../../../../utils/filtering/filterUtils.js';
import dataActionButtons, { dataActions } from '../../../../components/buttons/dataActionButtons.js';
import { RCT } from '../../../../config.js';
const { pageNames } = RCT;

const applicableDataActions = {
    [dataActions.hide]: true,
    [dataActions.reload]: true,
    [dataActions.downloadCSV]: true,
    [dataActions.copyLink]: true,
    [dataActions.showFilteringPanel]: true,
};

/**
 * Creates vnode containing table of fetched data (main content)
 * and additional features like page controller or columns visibility controller
 * @param model
 * @returns {*}
 */

export default function tablePanel(model, runs) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;
    const page = model.fetchedData[dataPointer.page];
    const { url } = page[dataPointer.index].payload;

    const chips = model.getSubPages(dataPointer.page)
        .filter((index) => index !== defaultIndexString)
        .map((index) => indexChip(model, dataPointer.page, index));

    data.rows = data.rows.filter((item) => item.name != 'null');

    const cellsSpecials = pagesCellsSpecials[dataPointer.page]; //

    const { fields } = data;
    const visibleFields = fields.filter((f) => f.marked);

    return dataPointer.index !== defaultIndexString || dataPointer.page == pageNames.periods
        ? h('.p-1rem', [
            h('.flex-wrap.justify-between.items-center',
                h('.flex-wrap.justify-between.items-center',
                    title(dataPointer.page),
                    chips),

                dataActionButtons(model, applicableDataActions)),
            model.showFilteringPanel ? filter(model) : '',
            anyFiltersActive(url) ? activeFilters(model, url) : '',

            data.rows?.length > 0
                ? visibleFields.length > 0
                    ? h('.p-top-05em',
                        h('.x-scrollable-table.border-sh',
                            pager(model, data, false),
                            h(`table.${dataPointer.page}-table`, {
                                id: `data-table-${data.url}`,
                            },
                            tableHeader(visibleFields, data, model),
                            model.sortingRowVisible ? sortingRow(visibleFields, data, model) : '',
                            tableBody(model, visibleFields, data, cellsSpecials, runs)),
                            data.rows.length > 15 ? pager(model, data) : ''))
                    : ''
                : anyFiltersActive(url)
                    ? noMatchingData(model, dataPointer.page)
                    : noDataFound(model),
        ])
        : noSubPageSelected(model);
}

function tableBody(
    model, visibleFields, data, cellsSpecials, runs,
) {
    return h('tbody', { id: `table-body-${data.url}` },
        data.rows.map((item) => row(
            model, visibleFields, data, item, cellsSpecials, runs,
        )));
}
