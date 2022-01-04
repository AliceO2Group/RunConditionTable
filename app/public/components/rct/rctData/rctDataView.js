import {h} from '/js/src/index.js';
import tableView from "./tableView.js";
import spinner from "../../common/spinner.js";
import viewButton from "../../common/viewButton.js";


/**
 * create vnode tableView if data are fetched otherwise shows spinner
 * @param model
 * @returns {*}
 */
export default function rctDataView(model) {
    const params = model.router.params;
    let data = model.fetchedData[params.page][params.index];

    return h('.homePage', [
        h('div.tableDiv', []),

        data.match({
            NotAsked: () => h('', 'not asked'),
            Loading: () => spinnerAndReloadView(model),
            Success: (data) => tableView(model),
            Failure: (status) => failureStatusAndReload(model, status)
        })
    ]);
}

function spinnerAndReloadView(model) {
    return h('.item-center.justify-center', [
        viewButton(model, 'reload data', () => model.fetchedData.reqForData(true), 'reload-btn'),
        spinner()]
    )
}

function failureStatusAndReload(model, status) {
    return h('.item-center.justify-center', [
        viewButton(model, 'reload data', () => model.fetchedData.reqForData(true), 'reload-btn'),
        h('', status)]
    )
}