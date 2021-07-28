import { h } from '/js/src/index.js';
import { goodBadOpt } from '../../utils/utils.js';

export default function RCTTableView(model) {
    return h('div.p3', h('table.table', {id: 'data-table'}, [

        h('thead.text-center', "Periods"),
        h('button.btn', {id: 'reload-btn', onclick: e => model.reqServerForRCTHomepage()}, 'reload data'),
        h('tbody', {id: 'periods-table-body'}, [
            h('tr', [
                h('th', {scope: "col"}, "id"),
                h('th', {scope: "col"}, "Data taking year"),
                h('th', {scope: "col"}, "Data taking period"),
                h('th', {scope: "col"}, "Beam"),
                h('th', {scope: "col"}, "Energy"),
                h('th', {scope: "col"}, "B field"),
                h('th', {scope: "col"}, "Statistics"),
                h('th', {scope: "col"},
                    h('.form-check.mv2', [
                        h('input.form-check-input', {
                            type: 'checkbox',
                            id: 'hide-marked',
                            onclick: (e) => model.changeRecordsVisibility()
                        }, ''),
                        h('label.form-check-label', {for: 'hide-marked'}, 'Hide marked')
                    ])
                )
            ]),
            model.fetchedData.mainRCTTable.metadata.fetched ? model.fetchedData.mainRCTTable.rows.map(item =>
                h(goodBadOpt(
                    'tr',
                    ['.bg-grey', '.d-none'],
                    ['.bg-warning', ''],
                    [!item.marked, model.hideMarkedRecords && item.marked]
                ), [
                    h('td', item.id),
                    h('td', item.year),
                    h('td', h('button.btn', {onclick: e => alert('TODO')}, item.period)),
                    h('td', item.beam),
                    h('td', item.energy),
                    h('td', 'b field'),
                    h('td', 'statistics'),

                    h('td', h('input.form-check-input.p1.mh4.justify-center.relative', {
                        style: 'margin-left=0',
                        type: 'checkbox',
                        id: 'record-mark',
                        onclick: (e) => model.changeItemStatus(item)
                    }))

                ])) : 'loading data',
        ])
    ]))
}

