import { h } from '/js/src/index.js';
import currentTableView from "./tableView.js";

export default function RCThomepage(model) {
    return h('.homePage', [
            h('h1.title', 'RCT Homepage'),
            h('div.tableDiv', []),
            currentTableView(model),
        ]);
}