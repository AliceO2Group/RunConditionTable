import { h, switchCase } from '/js/src/index.js';
import button from '../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import filter from './table/filter.js';
import fields from "./table/fields.js";

const rows = (colNames, model, data, buttonsFunctions) =>
        data.rows.map(item => row(colNames, model, item, buttonsFunctions));

// TODO reading which data object view it is supposed to return from model QueryRouter;
export default function tableView(model, data) {
    if (data.fetched) {
        const colNames = data.fields.filter(f => !(f.marked && data.hideMarkedRecords)).map(f => f.name);
        console.log('fields', data.fields);
        console.log('colNames', colNames);
        const buttonsFunctions = {
            period: (item) => {
                return (item) => {
                    alert(item.period);
                }
            }
        };
        const fieldsButtonsFunctions = null;

        return h('div.p3',
            h('table.table', {id: 'data-table-' + data.url}, [

                h('thead.text-center', data.name), ' ',
                button('reload data', () => data.fetch(), 'reload-btn'), ' ',

                h('tbody', {id: 'table-body-' + data.url}, [
                    tableHeader(colNames, data, () => model.changeRecordsVisibility()),
                    switchCase(model.router.params.page, {
                        periods: fields(colNames, data, fieldsButtonsFunctions).concat(rows(colNames, model, data, buttonsFunctions)),

                        // item: filter(() => model.reqServerForRCTFilter()),
                    })
                ])
            ]))
    } else {
        return button('reload data', () => data.fetch(), 'reload-btn');
    }
}
