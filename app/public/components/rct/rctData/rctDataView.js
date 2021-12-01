import {h} from '/js/src/index.js';
import tableView from "./tableView.js";
import spinner from "../../spinner.js";
import viewButton from "../../common/viewButton.js";


/**
 * create vnode tableView if data are fetched otherwise shows spinner
 * @param model
 * @returns {*}
 */
export default function rctDataView(model) {
    const params = model.router.params;
    let data = model.fetchedData[params.section][params.index];

    if (!data) {
        console.error('tableView error; data===null');
        data = model.fetchedData.reqForData();
        model.fetchedData[params.section][params.index] = data;
    }

    return h('.homePage', [
        h('h1.title', 'rct data view'),
        h('p', model.router.params.section),
        // TODO here might be filtering;
        h('div.tableDiv', []),

        data.fetched ? tableView(model) : h('.item-center.justify-center', [
            viewButton(model, 'reload data', () => data.fetch(), 'reload-btn'),
            spinner()]
        ),
    ]);
}