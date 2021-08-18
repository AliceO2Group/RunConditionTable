import { h } from '/js/src/index.js';
import tableView from "./tableView.js";

export default function rctDataView(model) {
    return h('.homePage', [
            h('h1.title', model.router.params.page),
            h('p', 'rct data view'),
            // TODO here might be filtering;
            h('div.tableDiv', []),
            tableView(model),
        ]);
}