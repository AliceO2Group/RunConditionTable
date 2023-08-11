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

import indexChip from '../../../../components/chips/indexChip.js';
import pager from '../../../../components/table/pager.js';
import { defaultIndexString } from '../../../../utils/defaults.js';
import { anyFiltersActive } from '../../../../utils/filtering/filterUtils.js';
import pagesCellsSpecials from '../../../userView/data/pagesCellsSpecials.js';
import title from '../../../../components/table/title.js';
import header from '../table/header.js';
import row from '../table/row.js';
import { h, iconDataTransferDownload, iconReload } from '/js/src/index.js';

import { RCT } from '../../../../config.js';
import downloadCSV from '../../../../utils/csvExport.js';
import filter from '../../../userView/data/table/filtering/filter.js';
import activeFilters from '../../../userView/data/table/filtering/activeFilters.js';
import sortingRow from '../../../userView/data/table/sortingRow.js';
import { noMatchingData, noDataFound } from '../../../../components/messagePanel/messages.js';
import noSubPageSelected from '../../../userView/data/table/noSubPageSelected.js';
import copyLinkButton from '../../../../components/buttons/copyLinkButton.js';
const { pageNames } = RCT;

export default function content(model, runs, detectors) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;
    const { url } = data;

    const chips = model.getSubPages(dataPointer.page)
        .filter((index) => index !== defaultIndexString)
        .map((index) => indexChip(model, dataPointer.page, index));

    const cellsSpecials = pagesCellsSpecials[dataPointer.page];

    const { fields } = data;
    const visibleFields = fields.filter((f) => f.marked);

    const functionalities = (model) => h('.btn-group',
        h('button.btn.btn-secondary.icon-only-button', {
            onclick: () => {
                model.fetchedData.reqForData(true);
                model.notify();
            },
        }, iconReload()),

        h('button.btn.btn-secondary.icon-only-button', {
            onclick: () => {
                downloadCSV(model);
            },
        }, iconDataTransferDownload()),

        copyLinkButton(model.router.getUrl().toString()),

        h('button.btn.icon-only-button', {
            className: model.searchFieldsVisible ? 'btn-primary' : 'btn-secondary',
            onclick: () => model.changeSearchFieldsVisibility(),
        }, model.searchFieldsVisible ? h('.slider-20-off-white.abs-center') : h('.slider-20-primary.abs-center')));

    return dataPointer.index === defaultIndexString
        ? noSubPageSelected(model)
        : h('.p-1em', [
            h('.flex-wrap.justify-between.items-center',
                h('.flex-wrap.justify-between.items-center',
                    title(pageNames.runsPerDataPass),
                    chips),

                functionalities(model)),
            model.searchFieldsVisible ? filter(model) : '',
            anyFiltersActive(url) ? activeFilters(model, url) : '',

            data.rows?.length > 0
                ? visibleFields.length > 0
                    ? h('.p-top-05em',
                        h('.x-scrollable-table.border-sh',
                            pager(model, data, false),
                            h('table', {
                                id: `data-table-${url}`,
                                className: `${[pageNames.runsPerDataPass, pageNames.runsPerPeriod].includes(dataPointer.page)
                                    ? 'runs-table'
                                    : `${dataPointer.page}-table`}`,
                            }, [
                                header(visibleFields, data, model),
                                model.sortingRowVisible ? sortingRow(visibleFields, data, model) : '',
                                tableBody(model, visibleFields, data, cellsSpecials, dataPointer.index, runs, detectors),
                            ]),
                            data.rows.length > 15 ? pager(model, data) : ''))
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
