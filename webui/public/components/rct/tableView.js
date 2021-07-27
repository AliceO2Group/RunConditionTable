import { h } from '/js/src/index.js';
import button from '../common/button.js';
import header from './table/header.js';
import row from './table/row.js';

export default function RCTTableView(model) {
    return h('div.p3', h('table.table', {id: 'data-table'}, [

        h('thead.text-center', "Periods"),
        button('reload data', () => model.reqServerForRCTHomePage(), 'reload-btn'),

        h('tbody', {id: 'periods-table-body'}, [
            header(() => model.changeRecordsVisibility()),
            model.RCTdataFetched ? model.RCTCurentContent.map(item => row(model, item)) : 'loading data',
        ])
    ]))
}
