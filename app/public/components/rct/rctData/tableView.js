import {h, switchCase} from '/js/src/index.js';
import viewButton from '../../common/viewButton.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import pagesCellsButtons from "./pagesCellsButtons.js";
import siteController from "./siteController.js";

import postingDataConfig from "./posting/postingDataConfig.js";
import {postForm} from "./posting/postForm.js";
import filter from './table/filter.js';

/**
 * creates vnode containing table of fetched data (main content)
 * and additional features like page controller or columns visibility controller
 * @param model
 * @returns {*}
 */

export default function tableView(model) {

    const params = model.router.params;
    const data = model.fetchedData[params.page][params.index].payload;

    const cellsButtons = pagesCellsButtons[params.page];

    const fields = data.fields;
    const visibleFields = fields.filter(f => f.marked);

    const filteringPanel = model.searchFieldsVisible? filter(model) : ' ';

    return h('div.p3', [
        filteringPanel,
        siteController(model, data),
        viewButton(model, 'reload data', () => model.fetchedData.reqForData(true), 'reload-btn'), ' ',
        h('table.table', {id: 'data-table-' + data.url}, [

            // h('caption', data.name),
            tableHeader(visibleFields, data, () => model.fetchedData.changeRecordsVisibility(data)),
            tableBody(model, visibleFields, data, cellsButtons, params)

        ])
    ])

}

function tableBody(model, visibleFields, data, cellsButtons, params) {
    return h('tbody', {id: 'table-body-' + data.url},
        [postingDataConfig.hasOwnProperty(params.page) ? postForm(model, data) : '']
            .concat(data.rows.map(item => row(model, visibleFields, data, item, cellsButtons)))
    );
}