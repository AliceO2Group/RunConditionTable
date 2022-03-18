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



import { h } from '/js/src/index.js';
import {getPathElems} from "../../../../utils/utils.js";
import {defaultIndex} from "../../../../utils/defaults.js";
import {RCT} from "../../../../config.js";
const dataReqParams = RCT.dataReqParams;


//TODO change filtering params on something like filtering types ...

export default function filter(model) {
    const pathIdent = getPathElems(model.router.getUrl().pathname);
    const page = pathIdent[0]
    const index = defaultIndex(pathIdent[1]);
    const data = model.fetchedData[page][index].payload;
    const fields = data.fields;

    const filteringParams = RCT.filteringParams.pages[page];
    console.log("filteringParams")
    console.log(filteringParams)


    const commands = ['match', 'exclude'];
    let inputFieldIds = [];

    commands.forEach((command) => {
        fields.forEach(field => {
            inputFieldIds.push(`${field.name}-${command}`);
        });
    });

    //TODO use some buttons creator
    return h('table.table-filters', [
        h('tbody', [
            labelsRow(model, fields),
            matchOrLowerBoundsInputs(fields),
            excludeOrUpperBoundsInputs(fields),
        ]),
        h('button.btn', {
            onclick: onclickSubmit(model, inputFieldIds)
        }, 'Submit'),
        h('button.btn', {
            onclick: onclickClear(model, inputFieldIds)
        }, 'Clear filters')
    ]);
}

const labelsRow = (model, fields) => {
    return h('tr', [
        h('.btn-group.w-50',
            h('td', [describingField('filter input type')]
                .concat(fields.map((field) => createClickableLabel(model, field))))
        )
    ])
}
const matchOrLowerBoundsInputs = (fields) => {
    return h('tr', [
        h('td', [describingField('match or lower bound')]
            .concat(fields.map((field) => createInputField(field, 'match'))))
    ]);
}
const excludeOrUpperBoundsInputs = (fields) => {
    return h('tr', [
        h('td', [describingField('exclude or upper bound')]
            .concat(fields.map((field) => createInputField(field, 'exclude'))))
    ])
}

const describingField = (name) => h('td', h('.container', {
    style: 'width:120px',
}, name));

const createClickableLabel = (model, field) => h('td', h('button.btn.filterLabel', {
    style: 'width:120px',
    onclick: () => model.fetchedData.changeItemStatus(field),
    className: field.marked ? 'active' : ''
}, field.name));

const createInputField = (field, command) => {
    const fieldId = `${field.name}-${command}`;

    return h('td', h('input.form-control', {
        style: 'width:120px',
        type: 'text',
        placeholder: '',
        id: fieldId,
    }));
};


const onclickSubmit = (model, inputFieldIds) => {
    return () => {
        const url = model.router.getUrl();

        let urlSearchParams = [];

        for (const [key, param] of Object.entries(inputFieldIds)) {
            if (document.getElementById(param)?.value != '')
                urlSearchParams.push(param);
        }

        if (urlSearchParams.length > 0) {
            const search = `?${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&`+
             (Object.entries(urlSearchParams).map(([k, v]) => {
                const val = document.getElementById(v)?.value;
                return (val?.length > 0)? `${v}=${val}` : '';
            })).join('&');
            

            const newUrl = new URL(url.origin + url.pathname + search);
            model.router.go(newUrl);
        } else {
            ///const newUrl = new URL(url.origin + url.pathname);
            model.router.go('/');
        }

        // model.router.go(newUrl);
        // model.notify();
    }
}

const onclickClear = (model, inputFieldIds) => {
    return () => {
        inputFieldIds.forEach(inputFieldId => {
                document.getElementById(inputFieldId).value=''
            });
    }
}