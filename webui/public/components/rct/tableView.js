import { h, switchCase } from '/js/src/index.js';
import button from '../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import filter from './table/filter.js';

const periods = (model) => model.fetchedData.mainRCTTable.metadata.fetched ?
        model.fetchedData.mainRCTTable.rows.map(item => row(model, item)) : 'loading data';

export default function RCTTableView(model) {
    return h('div.p3', h('table.table', {id: 'data-table'}, [

        h('thead.text-center', "Periods"),
        button('reload data', () => model.fetchedData.mainRCTTable.fetch(), 'reload-btn'),

        h('tbody', {id: 'periods-table-body'}, [
            tableHeader(() => model.changeRecordsVisibility()),
            switchCase(model.router.params.page, {
                periods: periods(model),
                // item: filter(() => model.reqServerForRCTFilter()),
            })
        ])
    ]))
}
