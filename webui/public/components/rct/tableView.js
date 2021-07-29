import { h, switchCase } from '/js/src/index.js';
import button from '../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import filter from './table/filter.js';
import container from "../common/container.js";

const rows = (model, colNames, data, buttonsFunctions) =>
        data.rows.map(item => row(model, colNames, data, item, buttonsFunctions));

function handleClick(model, e) {
    model.router.handleLinkEvent(e);
    model.notify();
}

const tableBody = (model, colNames, data, buttonsFunctions) => {
    return [tableHeader(colNames, data, () => model.changeRecordsVisibility(data))]
        .concat(rows(model, colNames, data, buttonsFunctions));
}

export default function currentTableView(model) {
    const params = model.router.params;
    return params.page === 'Rct-Data' ? switchCase(params.table, {
        periods: tableView(model, model.fetchedData.mainRCTTable, ),
        period: tableView(model, model.fetchedData.periods[params.period]),
        // item: filter(() => model.reqServerForRCTFilter()),
    }) : '';
}

// TODO reading which data object view it is supposed to return from model QueryRouter;
function tableView(model, data) {
    if (! data)
        return '';
        // model.reqForData();
    if (data.fetched) {
        const visibleFields = data.fields.filter(f => !(f.marked && data.hideMarkedRecords));

        // TODO need to be generalized for each table type;
        const colNames = visibleFields.map(f => f.name);
        const buttonsFunctions = {
            period: (item, name) => {
                return (e) => {
                    handleClick(model, e);
                }
            }
        };

        return h('div.p3',
            h('table.table', {id: 'data-table-' + data.url}, [

                h('thead.text-center', data.name), ' ',
                button('reload data', () => data.fetch(), 'reload-btn'), ' ',

                h('tbody', {id: 'table-body-' + data.url}, [
                    tableBody(model, colNames, data, buttonsFunctions),
                ])
            ]))
    } else {
        return container(
            h('p', "loading data... //TODO need some loading image/animation"),
            button('reload data', () => data.fetch(), 'reload-btn')
        );
    }
}
