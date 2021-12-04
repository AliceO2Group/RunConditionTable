import postingDataConfig from "./postingDataConfig.js";
import {h, fetchClient} from '/js/src/index.js';


// TODO move it to model
/**
 * returns vnode, row in table containing input fields and
 * button submit which allows to post data row e.g. to flags table
 * At which columns there will be input is defined in 'postingDataConfig.js'
 * @param model
 * @param data
 * @returns {*}
 */
export function postForm(model, data) {
    const params = model.router.params;
    const pageMetadata = postingDataConfig[params.section];
    return h('tr', data.fields.map(f => {
        if (pageMetadata !== undefined
            && pageMetadata['excludedFields'] !== undefined
            && pageMetadata['excludedFields'].includes(f.name)) {
            return h('td', '.');
        } else {
            return h('td', h('form', h('input', {id: 'input-form-' + f.name})));
        }
    }).concat([h('button.btn', {onclick: () => postData(model, data)}, 'submit')]))
}


const reqEndpoint = '/api/Rct-Data/insert-data'
async function postData(model, data) {
    const params = model.router.params;
    const pageMetadata = postingDataConfig[params.section];

    const dataObj = {}
    for (let f of data.fields) {
        if (!pageMetadata.excludedFields.includes(f.name)) {
            let input = document.getElementById('input-form-' + f.name);
            dataObj[f.name] = input.value;
        } else {
            dataObj[f.name] = 'DEFAULT';
        }
    }

    const response = await fetchClient(reqEndpoint, {
        method: 'POST',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({
            payload: {
                targetTable: pageMetadata.targetTable,
                data: dataObj,
            }
        })
    });

    const content = await response.json();
    alert(content.data);
    await model.fetchedData.reqForData(true);
    model.notify();
}