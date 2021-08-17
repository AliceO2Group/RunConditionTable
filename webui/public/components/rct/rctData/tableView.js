import { h, switchCase } from '/js/src/index.js';
import button from '../../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import container from "../../common/container.js";

import pagesCellsButtons from "./pagesCellsButtons.js";
import spinner from "../../spinner.js";
import filter from "./table/filter.js";


export default function tableView(model) {
    const params = model.router.params;
    var data =  model.fetchedData[params.page][params.index];

    const cellsButtons = pagesCellsButtons[params.page];

    if (! data) {
        console.error('tableView error; data===null');
        data = model.reqForData();
    }
    if (data.fetched) {
        const fields = data.fields;
        const visibleFields = fields.filter(f => f.marked);

        return h('div.p3',[
            // fieldsVisibilityControl(model, data, fields),
            button(model, 'reload data', () => data.fetch(), 'reload-btn'), ' ', // TODO move up
            h('table.table', {id: 'data-table-' + data.url}, [

                    h('caption', data.name),
                    tableHeader(visibleFields, data, () => data.changeRecordsVisibility(data)),
                    tableBody(model, visibleFields, data, cellsButtons)

                ])
            ])
    } else {
        return h('.item-center.justify-center',
            [button(model, 'reload data', () => data.fetch(), 'reload-btn'),
            spinner()]
        );
    }
}


function fieldsVisibilityControl(mode, data, fields) {
    return h('.p3', fields.map(f => h('label', [
                                        h('input.form-check-input.p3', {
                                            onclick: () => data.changeItemStatus(f),
                                            checked: f.marked,
                                            type: 'checkbox'
                                        }),
                                        f.name,
                                    ])
    ))
}



function tableBody(model, visibleFields, data, cellsButtons) {
    return h('tbody', {id: 'table-body-' + data.url},
        data.rows.map(item => row(model, visibleFields, data, item, cellsButtons))
    );
}