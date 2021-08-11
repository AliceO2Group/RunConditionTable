import { h, switchCase } from '/js/src/index.js';
import button from '../../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import container from "../../common/container.js";

import pagesCellsButtons from "./pagesCellsButtons.js";


// TODO bug: when mark some row and switch to another table then back cause marking error;

export default function tableView(model) {
    const params = model.router.params;
    var data =  model.fetchedData[params.page][params.index];

    const cellsButtons = pagesCellsButtons[params.page];

    if (! data) {
        console.log('tableView error; data===null');
        data = model.reqForData();
    }
    if (data.fetched) {
        const visibleFields = data.fields.filter(f => !(f.marked && data.hideMarkedRecords));

        // TODO need to be generalized for each table type;


        return h('div.p3',
            h('table.table', {id: 'data-table-' + data.url}, [

                h('thead.text-center', data.name), ' ',
                button(model, 'reload data', () => data.fetch(), 'reload-btn'), ' ',

                h('tbody', {id: 'table-body-' + data.url}, [
                    tableBody(model, visibleFields, data, cellsButtons),
                ])
            ]))
    } else {
        return container(
            h('p', "loading data... //TODO need some loading image/animation"),
            button(model, 'reload data', () => data.fetch(), 'reload-btn')
        );
    }
}


const rows = (model, visibleFields, data, cellsButtons) =>
    data.rows.map(item => row(model, visibleFields, data, item, cellsButtons));



const tableBody = (model, visibleFields, data, cellsButtons) => {
    return [tableHeader(visibleFields, data, () => data.changeRecordsVisibility(data))]
        .concat(rows(model, visibleFields, data, cellsButtons));
}