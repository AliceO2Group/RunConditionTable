/* eslint-disable no-unreachable */
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

import postingDataConfig from './postingDataConfig.js';
import { h, fetchClient } from '/js/src/index.js';
import { RCT } from '../../../../config.js';

// TODO move it to model
export function postForm(model, data) {
    alert('TODO');
    return;
    const { params } = model.router;
    const pageMetadata = postingDataConfig[params.page];
    return h('tr', data.fields.map((f) => {
        if (pageMetadata !== undefined
            && pageMetadata['excludedFields'] !== undefined
            && pageMetadata['excludedFields'].includes(f.name)) {
            return h('td', '.');
        } else {
            return h('td', h('form', h('input', { id: `input-form-${f.name}` })));
        }
    }).concat([h('button.btn', { onclick: () => postData(model, data) }, 'submit')]));
}

async function postData(model, data) {
    alert('TODO');
    return;
    const { params } = model.router;
    const pageMetadata = postingDataConfig[params.page];
    const reqEndpoint = `/api${RCT.endpoints.insertData}`;

    const dataObj = {};
    for (const f of data.fields) {
        if (!pageMetadata.excludedFields.includes(f.name)) {
            const input = document.getElementById(`input-form-${f.name}`);
            dataObj[f.name] = input.value;
        } else {
            dataObj[f.name] = 'DEFAULT';
        }
    }

    const response = await fetchClient(reqEndpoint, {
        //TODO
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            payload: {
                targetTable: pageMetadata.targetTable,
                data: dataObj,
            },
        }),
    });

    const content = await response.json();
    alert(content.data);
    await model.fetchedData.reqForData(true);
    model.notify();
}
