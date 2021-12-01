import {h, switchCase} from '/js/src/index.js';
import viewButton from '../../common/viewButton.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import pagesCellsButtons from "./pagesCellsButtons.js";
import siteController from "./siteController.js";

import postingDataConfig from "../postingDataConfig.js";
import {postForm} from "../postForm.js";

/**
 * creates vnode containing table of fetched data (main content)
 * and additional features like page controller or columns visibility controller
 * @param model
 * @returns {*}
 */

export default function tableView(model) {

    const params = model.router.params;
    const data = model.fetchedData[params.section][params.index].payload;

    const cellsButtons = pagesCellsButtons[params.section];

    const fields = data.fields;
    const visibleFields = fields.filter(f => f.marked);

    return h('div.p3', [
        fieldsVisibilityControl(model, data, fields),
        siteController(model, data),
        viewButton(model, 'reload data', () => model.fetchedData.reqForData(true), 'reload-btn'), ' ', // TODO move up
        h('table.table', {id: 'data-table-' + data.url}, [

            // h('caption', data.name),
            tableHeader(visibleFields, data, () => model.fetchedData.changeRecordsVisibility(data)),
            tableBody(model, visibleFields, data, cellsButtons, params)

        ])
    ])

}



function fieldsVisibilityControl(mode, data, fields) {
    return h('.flex-row.p3.justify-start', fields.map(f =>
        h('span.p1.thin-border', [
            h('.d-block.w-100', h('input.p3', {
                onclick: () => mode.fetchedData.changeItemStatus(f),
                checked: f.marked,
                type: 'checkbox'
            })),
            h('p', f.name)
        ])
    ))
}


function tableBody(model, visibleFields, data, cellsButtons, params) {
    return h('tbody', {id: 'table-body-' + data.url},
        [postingDataConfig.hasOwnProperty(params.section) ? postForm(model, data) : ''].concat(data.rows.map(item => row(model, visibleFields, data, item, cellsButtons)))
    );
}