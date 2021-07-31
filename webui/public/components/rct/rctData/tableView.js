import { h, switchCase } from '/js/src/index.js';
import button from '../../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import filter from './table/filter.js';
import container from "../../common/container.js";

import pagesCellsButtons from "./pagesCellsButtons.js";

// TODO need to define generalized rules for backend views naming;
// wich view is defined by params: page and index



const rows = (model, colNames, data, cellsButtons) =>
        data.rows.map(item => row(model, colNames, data, item, cellsButtons));



const tableBody = (model, colNames, data, cellsButtons) => {
    return [tableHeader(colNames, data, () => model.changeRecordsVisibility(data))]
        .concat(rows(model, colNames, data, cellsButtons));
}


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
        const colNames = visibleFields.map(f => f.name);


        return h('div.p3',
            h('table.table', {id: 'data-table-' + data.url}, [

                h('thead.text-center', data.name), ' ',
                button('reload data', () => data.fetch(), 'reload-btn'), ' ',

                h('tbody', {id: 'table-body-' + data.url}, [
                    tableBody(model, colNames, data, cellsButtons),
                ])
            ]))
    } else {
        return container(
            h('p', "loading data... //TODO need some loading image/animation"),
            button('reload data', () => data.fetch(), 'reload-btn')
        );
    }
}
