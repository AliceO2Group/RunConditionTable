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

import { h, iconDataTransferDownload, iconReload } from '/js/src/index.js';
// import downloadCSV from '../../utils/csvExport.js';
import downloadCSV from '../../../../utils/csvExport.js';
import tableHeader from './header.js';
import row from './row.js';
import pagesCellsSpecials from '../pagesCellsSpecials.js';
import pager from '../pager.js';

import postingDataConfig from '../posting/postingDataConfig.js';
import { postForm } from '../posting/postForm.js';
import filter from './filter.js';
import noDataView from './noDataView.js';

import { RCT } from '../../../../config.js';
import sortingRow from './sortingRow.js';
import itemsCounter from './items-counter.js';
const { pagesNames } = RCT;

/**
 * Creates vnode containing table of fetched data (main content)
 * and additional features like page controller or columns visibility controller
 * @param model
 * @returns {*}
 */

export default function tablePanel(model) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;
    data.rows = data.rows.filter((item) => item.name != 'null');

    if (data.rows?.length == 0) {
        return noDataView(model, dataPointer);
    }

    const cellsSpecials = pagesCellsSpecials[dataPointer.page];

    const { fields } = data;
    const visibleFields = fields.filter((f) => f.marked);

    const filteringPanel = model.searchFieldsVisible ? filter(model) : ' ';

    const headerSpecific = (model) => {
        const { page, index } = model.getCurrentDataPointer();
        switch (page) {
            case 'periods': return 'Periods';
            case 'runsPerPeriod': return 'Runs per period';//  period index
            case 'runsPerDataPass': return 'Runs per data pass'; // data pass index
            case 'dataPasses': return 'Data passes per period'; // period index
            case 'mc': return 'Monte Carlo'; // period index
            case 'flags': return 'Flags'; // run index
            default: return null;
        }
    };

    const functionalities = (model) => h('.btn-group',
    h('button.btn.icon-only-button', {
        onclick: () => {
            model.fetchedData.reqForData(true);
            model.notify();
        },
    }, iconReload()),

    h('button.btn.icon-only-button', {
        onclick: () => {
            downloadCSV(model);
        },
    }, iconDataTransferDownload()),

    h('button.btn.icon-only-button', {
        className: model.searchFieldsVisible ? 'selected' : '',
        onclick: () => model.changeSearchFieldsVisibility(),
    }, h('.filter-20.abs-center')));

    return h('div.mainContent', [
       h('div.flex-wrap.justify-between.items-center', 
        h('div.flex-wrap.justify-between.items-baseline',
            h('h3.p-left-15', headerSpecific(model)),
             model.getCurrentDataPointer().page !== 'periods' ? h('div.chip.p-left-15', model.getCurrentDataPointer().index, h('.close-10')) : '',
            h('div.italic.p-left-5', itemsCounter(data)),
            //h('button.btn.small-settings-btn',
            h('.settings-20'),// ),
       ),
       
        h('div', functionalities(model)),
    ),
    filteringPanel,
       visibleFields.length > 0
            ? h('',
                // data.rows.length > 15 ? pager(model, data, 1) : '',
                h('.x-scrollable-table.border-sh',
                pager(model, data, 1),
                    h('table.data-table', {
                        id: `data-table-${data.url}`,
                        className: `${
                            dataPointer.page === pagesNames.periods
                                ? 'periods-table'
                                : [pagesNames.runsPerDataPass, pagesNames.runsPerPeriod].includes(dataPointer.page)
                                    ? 'runs-table'
                                    : dataPointer.page === pagesNames.dataPasses
                                        ? 'data-passes-table'
                                        : ''}`,
                    }, [
                        tableHeader(visibleFields, data, model),
                        sortingRow(visibleFields, data, model),
                        tableBody(model, visibleFields, data, cellsSpecials, dataPointer.page),
                    ]),
                    data.rows.length > 15 ? pager(model, data, 2) : '',
                ))
                // pager(model, data, 2))
            : '',
    ]);
}

function tableBody(
    model, visibleFields, data, cellsSpecials, page,
) {
    return h('tbody', { id: `table-body-${data.url}` },
        [postingDataConfig[page] ? postForm(model, data) : '']
            .concat(data.rows.map((item) => row(
                model, visibleFields, data, item, cellsSpecials,
            ))));
}
