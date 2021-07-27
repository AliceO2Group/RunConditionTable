import { h } from '/js/src/index.js';
import RCTTableView from './tableView.js';

export default function RCTHomepage(model) {
    return h('.homePage', [
            h('h1.title', 'RCT Homepage'),
            h('div.tableDiv', []),
            RCTTableView(model)
        ]);
}