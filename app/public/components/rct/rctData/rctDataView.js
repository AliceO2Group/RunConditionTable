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
    const pathIden = model.router.getUrl().pathname.slice(1, -1).split('/')
    let data = model.fetchedData[pathIden[0]][defaultIndex(pathIden[1])];

    return h('.homePage', [
        h('div.tableDiv', []),

        data ? data.match({
            NotAsked: () => h('', 'not asked'),
            Loading: () => spinnerAndReloadView(model),
            Success: (data) => tableView(model),
            Failure: (status) => failureStatusAndReload(model, status)
        }) : h('', "data null :: Arrr...")
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