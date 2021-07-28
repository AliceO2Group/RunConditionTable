import { h, switchCase } from '/js/src/index.js';
import button from '../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import filter from './table/filter.js';

const menu = (model) => h('ul', [
    h('li', h('a', {onclick: (e) => {model.router.handleLinkEvent(e); model.notify();}, href: '?page=periods'}, 'Periods')),
    h('li', h('a', {onclick: (e) => {model.router.handleLinkEvent(e); model.notify();}, href: '?page=item&id=1'}, 'Item 1')),
    h('li', h('a', {onclick: (e) => model.router.handleLinkEvent(e), href: '?page=item&id=2'}, 'Item 2')),
    h('li', h('a', {onclick: (e) => model.router.handleLinkEvent(e), href: '?page=item&id=3'}, 'Item 3')),
  ]);

const periods = (model) => model.RCTdataFetched ? model.RCTCurentContent.map(item => row(model, item)) : 'loading data';

export default function RCTTableView(model) {
    return h('div.p3', h('table.table', {id: 'data-table'}, [

        h('thead.text-center', "Periods"),
        button('reload data', () => model.reqServerForRCTHomePage(), 'reload-btn'),

        h('tbody', {id: 'periods-table-body'}, [
            menu(model),
            tableHeader(() => model.changeRecordsVisibility()),
            switchCase(model.router.params.page, {
                periods: periods(model),
                item: filter(() => model.reqServerForRCTFilter()),
            })
        ])
    ]))
}
