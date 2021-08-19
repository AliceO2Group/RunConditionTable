import {h, switchCase} from '/js/src/index.js';
import button from '../../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import pagesCellsButtons from "./pagesCellsButtons.js";


export default function tableView(model) {

    const params = model.router.params;
    const data = model.fetchedData[params.page][params.index];

    const cellsButtons = pagesCellsButtons[params.page];

    const fields = data.fields;
    const visibleFields = fields.filter(f => f.marked);

    return h('div.p3', [
        fieldsVisibilityControl(model, data, fields),
        button(model, 'reload data', () => data.fetch(), 'reload-btn'), ' ', // TODO move up
        h('table.table', {id: 'data-table-' + data.url}, [

            // h('caption', data.name),
            tableHeader(visibleFields, data, () => data.changeRecordsVisibility(data)),
            tableBody(model, visibleFields, data, cellsButtons)

        ])
    ])

}


// function fieldsVisibilityControl(mode, data, fields) {
//     return h('.flex-row.p3', fields.map(f =>
//         h('.d-inline.p1',[
//             h('input.form-check-input.p3.d-block', {
//                 onclick: () => data.changeItemStatus(f),
//                 checked: f.marked,
//                 type: 'checkbox'
//             }),
//             f.name,
//         ])
//     ))
// }

function fieldsVisibilityControl(mode, data, fields) {
    return h('.flex-row.p3.justify-start', fields.map(f =>
        h('span.p1.thin-border', [
            h('.d-block.w-100', h('input.p3', {
                onclick: () => data.changeItemStatus(f),
                checked: f.marked,
                type: 'checkbox'
            })),
            h('p', f.name)
        ])
    ))
}


function tableBody(model, visibleFields, data, cellsButtons) {
    return h('tbody', {id: 'table-body-' + data.url},
        data.rows.map(item => row(model, visibleFields, data, item, cellsButtons))
    );
}