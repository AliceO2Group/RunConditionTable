import { h } from '/js/src/index.js';
import RCTTableView from './tableView.js';

export default function RCTHomepage(model) {
    return h('.flex-column.items-center.justify-center',
        h('.bg-gray-lighter.br3.p4', [
            h('h1.primary.justify_center', 'RCT Homepage'),
            h('div.flex-row.items-end', []),
            RCTTableView(model)
        ])
    );
}