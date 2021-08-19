import {h} from '/js/src/index.js';
import tableView from "./tableView.js";
import spinner from "../../spinner.js";
import button from "../../common/button.js";

export default function rctDataView(model) {
    const params = model.router.params;
    var data = model.fetchedData[params.page][params.index];

    if (!data) {
        console.error('tableView error; data===null');
        data = model.reqForData();
        model.fetchedData[params.page][params.index] = data;
    }

    return h('.homePage', [
        h('h1.title', 'rct data view'),
        h('p', model.router.params.page),
        // TODO here might be filtering;
        h('div.tableDiv', []),
        data.fetched ? tableView(model) : h('.item-center.justify-center', [
            button(model, 'reload data', () => data.fetch(), 'reload-btn'),
            spinner()]
        ),
    ]);
}