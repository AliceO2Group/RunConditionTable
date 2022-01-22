/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */



import postingDataConfig from "./postingDataConfig.js";
import {h, fetchClient} from '/js/src/index.js';
import applicationProperties from "../../../../applicationProperties.js";

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
    const pageMetadata = postingDataConfig[params.page];
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


async function postData(model, data) {
    const params = model.router.params;
    const pageMetadata = postingDataConfig[params.page];
    const reqEndpoint = '/api' + applicationProperties.endpoints.insertData;

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
        //TODO
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