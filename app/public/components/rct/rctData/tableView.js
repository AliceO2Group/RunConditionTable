import {h} from '/js/src/index.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import pagesCellsButtons from "./pagesCellsButtons.js";
import siteController from "./siteController.js";

import postingDataConfig from "./posting/postingDataConfig.js";
import {postForm} from "./posting/postForm.js";
import filter from './table/filter.js';
import {getPathElems} from "../../../utils/utils.js";
import {defaultIndex} from "../../../utils/defaults.js";

/**
 * creates vnode containing table of fetched data (main content)
 * and additional features like page controller or columns visibility controller
 * @param model
 * @returns {*}
 */

export default function tableView(model) {

    const pathIdents = getPathElems(model.router.getUrl().pathname)
    const data = model.fetchedData[pathIdents[0]][defaultIndex(pathIdents[1])].payload;

    const cellsButtons = pagesCellsButtons[pathIdents[0]];

    const fields = data.fields;
    const visibleFields = fields.filter(f => f.marked);

    const filteringPanel = model.searchFieldsVisible? filter(model) : ' ';

    return h('div.p3', [
        filteringPanel,
        siteController(model, data),
        
        h('table.table', {id: 'data-table-' + data.url}, [
            tableHeader(visibleFields, data, () => model.fetchedData.changeRecordsVisibility(data)),
            tableBody(model, visibleFields, data, cellsButtons, pathIdents[0])
        ])
    ])

}

function tableBody(model, visibleFields, data, cellsButtons, page) {
    return h('tbody', {id: 'table-body-' + data.url},
        [postingDataConfig.hasOwnProperty(page) ? postForm(model, data) : '']
            .concat(data.rows.map(item => row(model, visibleFields, data, item, cellsButtons)))
    );
}