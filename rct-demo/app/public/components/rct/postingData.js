import postingDataConfig from "./postingDataConfig.js";
import {h} from '/js/src/index.js';
import {fetchClient} from "@aliceo2/web-ui/Frontend/js/src";


export function postForm(model, data) {
    const params = model.router.params;
    const pageMetadata = postingDataConfig[params.page];
    return h('tr', data.fields.map(f => {
        if (pageMetadata !== undefined
            && pageMetadata['excludedFields'] !== undefined
            && pageMetadata['excludedFields'].includes(f.name)) {
            return h('td', '.');
        } else {
            return h('td', h('form', h('input', {id: 'input-form-' + f.name})));
        }
    }).concat([h('button.btn', {onclick: () => {}}, 'submit')]))
}

async function postData(model, data) {
    const params = model.router.params;
    const pageMetadata = postingDataConfig[params.page];

    const dataObj = {}
    for (let f of data.fields) {
        if (!pageMetadata.excludedFields.includes(f.name)) {
            let input = document.getElementById('input-form-' + f.name);
            dataObj[f.name] = input.value;
        } else {
            dataObj[f.name] = 'DEFAULT';
        }
    }

    const reqEndpoint = '/api/Rct-Data/insert-data'
    const response = await fetchClient(reqEndpoint, {
        method: 'POST',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        payload: {
            view: pageMetadata.targetTable,
            data: dataObj,
        }
    });
}