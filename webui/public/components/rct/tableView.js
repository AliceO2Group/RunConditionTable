import { h, switchCase } from '/js/src/index.js';
import button from '../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import filter from './table/filter.js';
import fields from "./table/fields.js";
import container from "../common/container.js";

const rows = (model, colNames, data, buttonsFunctions) =>
        data.rows.map(item => row(model, colNames, data, item, buttonsFunctions));

// TODO reading which data object view it is supposed to return from model QueryRouter;
export default function tableView(model, data) {
    if (data.fetched) {
        const colNames = data.fields.filter(f => !(f.marked && data.hideMarkedRecords)).map(f => f.name);
        console.log('fields', data.fields);
        console.log('colNames', colNames);
        const buttonsFunctions = {
            period: (item, name) => {
                return (item) => {
                    alert(item[name]);
                }
            }
        };
        const fieldsButtonsFunctions = null;

        return h('div.p3',
            h('table.table', {id: 'data-table-' + data.url}, [

                h('thead.text-center', data.name), ' ',
                button('reload data', () => data.fetch(), 'reload-btn'), ' ',

                h('tbody', {id: 'table-body-' + data.url}, [
                    tableHeader(colNames, data, () => model.changeRecordsVisibility(data)),
                    switchCase(model.router.params.page, {
                        periods: fields(model, colNames, data, fieldsButtonsFunctions).concat(rows(model, colNames, data, buttonsFunctions)),

                        // item: filter(() => model.reqServerForRCTFilter()),
                    })
                ])
            ]))
    } else {
        return container(
            h('p', "loading data... //TODO need some loading image/animation"),
            button('reload data', () => data.fetch(), 'reload-btn')
        );
    }
}
