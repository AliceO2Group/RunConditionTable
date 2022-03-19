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
import {RCT} from "../../../../config.js";
const dataReqParams = RCT.dataReqParams;


export default function filter(model) {
    
    const data = model.getCurrentData();
    const fields = data.fields;

    const dataPointer = model.getCurrentDataPointer();

    const pageFilteringTypes = RCT.filteringParams.pages[dataPointer.page];
    const filteringTypes = RCT.filteringParams.types;
    
    const upperInputIds = getUpperInputIds(fields, pageFilteringTypes, filteringTypes);
    const lowerInputIds = getLowerInputIds(fields, pageFilteringTypes, filteringTypes);
    const inputsIds = upperInputIds.concat(lowerInputIds);

    const params = model.router.params

    return h('table.table-filters', [
        h('tbody', [
            labelsRow(model, fields),
            inputsRow(params, upperInputIds, "match/from"),
            inputsRow(params, lowerInputIds, "exclude/to"),
        ]),
        h('button.btn', {
            onclick: onclickSubmit(model, inputsIds)
        }, 'Submit'),
        h('button.btn', {
            onclick: onclickClear(model, inputsIds)
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


const inputsRow = (params, inputsIds, description) => {
    return h('tr', [
        h('td', [describingField(description)]
            .concat(inputsIds.map(id => {
                return createInputField(id, params[id]);
            }
            )))
    ]);
}


const describingField = (name) => h('td', h('.container', {
    style: 'width:120px',
}, name));

const createClickableLabel = (model, field) => h('td', h('button.btn.filterLabel', {
    style: 'width:120px',
    onclick: () => model.fetchedData.changeItemStatus(field),
    className: field.marked ? 'active' : ''
}, field.name));


const createInputField = (inputId, currentValue) => {
    return h('td', h('input.form-control', {
        style: 'width:120px',
        type: 'text',
        value: currentValue ? currentValue : '',
        id: inputId,
    }));
};


const onclickSubmit = (model, inputsIds) => {
    return () => {

        const filteringParamsPhrase = inputsIds
            .map(inputId => [
                inputId, 
                document.getElementById(inputId)?.value
            ])
            .filter(([id, v]) => v?.length > 0)
            .map(([id, v]) => `${id}=${v}`)
            .join('&')

        console.log(filteringParamsPhrase)
        const newSearch = `?${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&` + filteringParamsPhrase

        const url = model.router.getUrl();
        const newUrl = new URL(url.origin + url.pathname + newSearch);
        model.router.go(newUrl);
    }
}



const onclickClear = (model, inputsIds) => {
    return () => {
        inputsIds.forEach(inputId => {
                document.getElementById(inputId).value=''
            });
        onclickSubmit(model, inputsIds)();
    }
}

const getUpperInputIds = (fields, pageFilteringTypes, filteringTypes) => {
    return fields.map(f => filedName2MatchFromType(f.name, pageFilteringTypes, filteringTypes))
}

const getLowerInputIds = (fields, pagesFilteringTypes, filteringTypes) => {
    return fields.map(f => filedName2ExcludeToType(f.name, pagesFilteringTypes, filteringTypes))
}


const filedName2MatchFromType = (fieldName, pageFilteringTypes, filteringTypes) => {
    if (pageFilteringTypes[fieldName] === filteringTypes.matchExcludeType)
        return `${fieldName}-match`;
    else if (pageFilteringTypes[fieldName] === filteringTypes.fromToType)
        return `${fieldName}-from`;
    else
        console.error("probably incorrect configuration of filtering types");
}

const filedName2ExcludeToType = (fieldName, pagesFilteringParams, filteringTypes) => {
    if (pagesFilteringParams[fieldName] === filteringTypes.matchExcludeType)
        return `${fieldName}-exclude`;
    else if (pagesFilteringParams[fieldName] === filteringTypes.fromToType)
        return `${fieldName}-to`;
    else
        console.error("probably incorrect configuration of filtering types");
}



// const saveFiteringParams = (model, upperInputIds, lowerInputIds) => {
//     const fields = model.getCurrentData().fields

//     fields.forEach(f => f.filtering = {})
//     zip(fields, upperInputIds).forEach(([f, id]) => {
//         f.filtering[id] = document.getElementById(id)?.value;
//     })
//     zip(fields, lowerInputIds).forEach(([f, id]) => {
//         f.filtering[id] = document.getElementById(id)?.value;
//     })
    
// }