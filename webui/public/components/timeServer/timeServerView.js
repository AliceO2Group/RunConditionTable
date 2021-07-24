import { h } from '/js/src/index.js';
import { goodBadOpt } from '../../utils/utils.js'

export function timeServerContent(model) {
    return h('.flex-column.items-center.justify-center',
        h('.bg-gray-lighter.br3.p4', [
            h('h1.primary', 'TIME SERVER'),
            h('ul', [
                h('li', `local counter: ${model.count}`),
                h('li', `remote date: ${model.date}`),
            ]),
            h('div.flex-row.items-end', [
                h('div.flex-column', [
                    h('button.btn', {onclick: e => model.increment()}, '++'),
                    h('button.btn', {onclick: e => model.decrement()}, '--')
                ]), ' ',

                h('button.btn', {onclick: e => model.fetchDate()}, 'Get date from server'), '  ',

                h('form', [
                    h('label', {for: "stream-for"}, "Stream interval"),
                    h('input.stream-for', {id: "stream-for", type: 'input', placeholder: "1000"}, '')
                ]), ' ',
                h('form', [
                    h('label', {for: "stream-step"}, "Stream step"),
                    h('input.stream-by', {id: "stream-step", type: 'input', placeholder: "100"}, '')

                ]), ' ',
                h('button.btn', {
                    onclick: onClick_Stream
                }, 'Stream'), ' ',
            ]),
            timeServerTableView(model)
        ])
    );
}

export function onClick_Stream(e) {
    const streamForInput = document.getElementById("stream-for");
    let interval = Number(streamForInput.value);
    interval = interval > 0 ? interval : Number(streamForInput.placeholder)

    const streamStepInput = document.getElementById("stream-step");
    let step = Number(streamStepInput.value);
    step = step > 0 ? step : Number(streamStepInput.placeholder)

    model.streamDate(model.lastIndex, interval, step);


    model.add({
        rowIndex: model.lastIndex,
        interval: interval,
        step: step,
        responses: 0,
        marked: false,
    });

}

export function timeServerTableView(model) {
    return h('div.p3', h('table.table', {id: 'data-table'}, [
        // h('caption.', "Data table"),
        // h('colgroup'),
        h('thead.text-center', "Stream requests"),
        h('tbody', {id: 'data-table-body'}, [
            h('tr', [
                h('th', {scope: "col"}, "probe indxe"),
                h('th', {scope: "col"}, "interval"),
                h('th', {scope: "col"}, "step"),
                h('th', {scope: "col"}, "responses"),
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
            model.timeServerList.map(item =>
                h(goodBadOpt(
                    'tr',
                    ['.bg-grey', '.d-none'],
                    ['.bg-warning', ''],
                    [!item.marked, model.hideMarkedRecords && item.marked]
                ), [
                    h('td', item.index),
                    h('td', item.interval),
                    h('td', item.step),
                    h('td', item.responses + '/' + Math.floor(item.interval / item.step)),
                    h('td', h('.p1.justify-center', h('input.form-check-input.relative', {
                        type: 'checkbox',
                        id: 'record-mark',
                        onclick: (e) => model.changeItemStatus(item)
                    })))

                ]))
        ])
    ]))

}
