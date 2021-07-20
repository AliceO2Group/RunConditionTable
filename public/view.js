/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import {h, render} from '/js/src/index.js';
import sessionService from '/js/src/sessionService.js';

const zip = (a, b) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);
const goodBadOpt = (n, goodOpts, badOpts, opts) =>
    zip(zip(goodOpts, badOpts), opts).reduce(
        (acc, ent) => acc + (Boolean(ent[1]) ? ent[0][0] : ent[0][1]),
        n)


// The view
export default function view(model) {
    if (!model.logged) {
        return loggingSite(model);
    } else {
        return userPanel(model);
    }
}

function loggingSite(model) {
    return h('div.flex-column.items-center.justify-center',
        h('div.flex-column.bg-gray-lighter.br3.p4', [
            h('h1.primary', 'TEST APP'), ' ',
            h('form', [
                h('label', {for: "dbname"}, ""),
                h('input', {id: "dbname", type: 'input', placeholder: "cern_db"}, '')
            ]),
            h('form', [
                h('label', {for: "username"}, ""),
                h('input', {id: "username", type: 'input', placeholder: "username"}, '')
            ]), ' ',
            h('form', [
                h('label', {for: "password"}, ""),
                h('input', {id: "password", type: 'password', placeholder: "password"}, '')
            ]),

            h('.flex-wrap.justify-center',
                h('div', [
                    h('.pv2', h('button.btn.justify-center.items-center', {
                        onclick: async e => {
                            const username = document.getElementById('username').value;
                            const password = document.getElementById('password').value;
                            const dbnameEl = document.getElementById('dbname');
                            const dbname = dbnameEl.value ? dbnameEl.value !== '' : dbnameEl.placeholder;

                            const p = await model.login(username, password, dbname);
                            console.log(window.session);
                        }
                    }, "login")),
                    h('.pv2', h('button.btn', {onclick: e => alert("TODO, now you are logged as: " + window.session.name)}, "register"))
                ])
            )
        ])
    )
}

function userPanel(model) {
    return h('.flex-column.absolute-fill', [
        // menu bar
        h('.bg-white.flex-row.p2.shadow-level2.level2', {id: 'menu'}, [
            h('.flex-grow.text-left', [
                h('button.btn', {onclick: e => {
                        // alert('TODO')
                        console.log(sessionService.session);
                    }}, 'opts')
            ]), ' ',
            h('.w-50.text-center', [
                h('h4.primary', 'TEST APP PANEL')
            ]), ' ',
            h('.flex-grow', [
                h('input', {id: 'main-panel-search', placeholder: 'search', type: 'input'})
            ]), ' ',
            h('flex-grow.text-right', [
                h('button.btn', {onclick: e => model.logout()}, 'logout')
            ])
        ]),
        // content below menu bar
        h('.flex-grow.flex-row', [
            // sidebar
            h('.sidebar.flex-column', [
                h(goodBadOpt('button.btn.p1.m1', ['.btn-primary'], ['.btn-success'], [!model.timeServerContentVisible]),
                    {
                        id: 'time-server-hide-show-btn',
                        onclick: e => model.showHideTimeServerContent()
                    }, 'time server'), ' ',
                h(goodBadOpt('button.btn.p1.m1', ['.btn-primary'], ['.btn-success'], [!model.RCTHomepageVisible]),
                    {id: 'RCT-main-show-btn', onclick: e => model.showHideRCTHomepage()}, 'RCT main'), ' ',
            ]), ' ',
            // content
            h('.flex-grow.relative', [
                h('.scroll-y.absolute-fill.bg-white.p3.m2', {id: 'main-content'}, [
                    h('h2.gray', 'MAIN CONTENT'),
                    model.timeServerContentVisible ? timeServerContent(model) : '',
                    model.RCTHomepageVisible ? RCTHomepage(model) : '',
                ])
            ])
        ])
    ])
}


function RCTHomepage(model) {
    return h('.flex-column.items-center.justify-center',
        h('.bg-gray-lighter.br3.p4', [
            h('h1.primary.justify_center', 'RCT Homepage'),
            h('div.flex-row.items-end', []),
            RCTTableView(model)
        ])
    );
}

function RCTTableView(model) {
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
            model.RCTdataFetched ? model.RCTCurentContent.map(item =>
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


function timeServerContent(model) {
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

function onClick_Stream(e) {
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

function timeServerTableView(model) {
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
            model.list.map(item =>
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