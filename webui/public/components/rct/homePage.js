import { h } from '/js/src/index.js';
import tableView from "./tableView.js";

export default function RCTHomepage(model) {
    return h('.homePage', [
            h('h1.title', 'RCT Homepage'),
            h('div.tableDiv', []),
            tableView(model, model.fetchedData.mainRCTTable),
        ]);
}