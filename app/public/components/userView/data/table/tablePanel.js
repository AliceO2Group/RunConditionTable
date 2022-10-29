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
import pager from '../pager.js';

import postingDataConfig from '../posting/postingDataConfig.js';
import { postForm } from '../posting/postForm.js';
import filter from './filter.js';

/**
 * Creates vnode containing table of fetched data (main content)
 * and additional features like page controller or columns visibility controller
 * @param model
 * @returns {*}
 */

export default function tablePanel(model) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;

    if (data.rows?.length == 0) {
        const removeAndGoBackBtn = h('button.btn.btn-primary',
            { onclick: () => model.removeCurrentData() }, 'Go Back & Remove This Page');
        const noDataMessage = h('h3', 'No data found');
        return h('.loginDiv.top-100', [
            h('.nothing-found-90'),
            noDataMessage,
            removeAndGoBackBtn,
        ]);
    }
    const cellsSpecials = pagesCellsSpecials[dataPointer.page];

    const { fields } = data;
    const visibleFields = fields.filter((f) => f.marked);

    const filteringPanel = model.searchFieldsVisible ? filter(model) : ' ';

    return h('div', [
        filteringPanel,
        pager(model, data, 1),
        h('div', h('div.x-scrollable',
            h('table.table', { id: `data-table-${data.url}` }, [
                tableHeader(visibleFields, data, model),
                tableBody(
                    model, visibleFields, data, cellsSpecials, dataPointer.page,
                ),
            ]))),
        pager(model, data, 2),
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
