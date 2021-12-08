import {h} from '/js/src/index.js';

export default function home(model) {
    return h('.flex-wrap.justify-center', [
        h('table.table table-sm', [
            h('thead', [
                h('tr', [
                    h('th', 'Data taking year'),
                    h('th', 'Data taking period'),
                    h('th', 'Beam'),
                    h('th', 'Energy'),
                    h('th', 'B field'),
                    h('th', 'Statistics'),
                ])
            ]),
            h('tbody', [
                h('tr', [
                    h('td', 2022),
                    h('td', 'LHC22a'),
                    h('td', 'PbPb'),
                    h('td', '5 TeV'),
                    h('td', '+0.5T'),
                    h('td', '12345 collisions'),
                ]),
                h('tr', [
                    h('td', 2022),
                    h('td', 'LHC22b'),
                    h('td', 'pp'),
                    h('td', '5 TeV'),
                    h('td', '-0.5T'),
                    h('td', '54321 collisions'),
                ]),
                h('tr', [
                    h('td', 2022),
                    h('td', 'LHC22c'),
                    h('td', 'HeHe'),
                    h('td', '5 TeV'),
                    h('td', '-0.5T'),
                    h('td', '12357 collisions'),
                ])
            ])
        ])
    ]);
  //      h('h.title', 'welcome :)')]/*(.concat(range(0, 20).map(() => spinner())));*/
}