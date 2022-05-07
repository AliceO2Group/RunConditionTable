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
import { RCT } from '../../../../config.js';
import tooltip from '../../../common/tooltip.js';
const { dataReqParams } = RCT;

const makeTooltipsTableCellLike = true;

export default function filter(model) {
    const data = model.getCurrentData();
    const { fields } = data;

    const dataPointer = model.getCurrentDataPointer();

    const pageFilteringTypes = RCT.filteringParams.pages[dataPointer.page];
    const filteringTypes = RCT.filteringParams.types;

    const upperInputIds = getUpperInputIds(fields, pageFilteringTypes, filteringTypes);
    const lowerInputIds = getLowerInputIds(fields, pageFilteringTypes, filteringTypes);
    const inputsIds = upperInputIds.concat(lowerInputIds);

    const { params } = model.router;

    return h('div', 
        // h('style', {id: 'css'}),
        h('div.x-scrollable',
            h('table',
                h('tbody.tableScrollable',
                    labelsRow(model, fields),
                    inputsRow(params, upperInputIds),
                    inputsRow(params, lowerInputIds),
                ),
            )
        ),
        h('button.btn', {
            onclick: onclickSubmit(model, inputsIds),
        }, 'Submit'),
        h('button.btn', {
            onclick: onclickClear(model, inputsIds),
        }, 'Clear filters'),
    );
}

const labelsRow = (model, fields) => h('tr',
    fields.map((field) => createClickableLabel(model, field))
);

const inputsRow = (params, inputsIds) => h('tr',
    inputsIds.map((id) => createInputField(id, params[id])),
);

const createClickableLabel = (model, field) =>
    h('th.tooltip.noBorderBottom.table-cell-like',
        h('button.btn.tooltipCell', {
                style: 'width:120px',
                onclick: () => model.fetchedData.changeItemStatus(field),
                className: field.marked ? 'active' : '',
            }, field.name,
            h('span.tooltiptext', field.marked ? 'hide' : 'display')
        ),
    );

const createInputField = (inputId, currentValue) =>
h('th.my-tooltip.noBorderBottom.table-cell-like',
    h('div.inh', 
        h('input.form-control', {
            style: 'width:120px',
            type: 'text',
            value: currentValue ? currentValue : '',
            id: inputId,
        }),
        h('span.tooltiptext', `${inputId.substring(inputId.indexOf('-') + 1)}`)
    )// ,
    // h('span.tooltiptext', `${inputId.substring(inputId.indexOf('-') + 1)}`)
);
/*
tooltip(
    h('td', h('input.form-control.tooltipCell', {
        style: 'width:120px',
        type: 'text',
        value: currentValue ? currentValue : '',
        id: inputId,
    })),
    inputId.substring(inputId.indexOf('-') + 1),
    makeTooltipsTableCellLike
)
*/

const onclickSubmit = (model, inputsIds) => () => {
    const filteringParamsPhrase = inputsIds
        .map((inputId) => [
            inputId,
            [...document.getElementById(inputId)?.value].map(c => c == '%'? '%25' : c).join(''),
        ])
        .filter(([_, v]) => v?.length > 0)
        .map(([id, v]) => `${id}=${v}`)
        .join('&');

    const newSearch = `?${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&${filteringParamsPhrase}`;

    const url = model.router.getUrl();
    const newUrl = new URL(url.origin + url.pathname + newSearch);
    model.router.go(newUrl);
};

const onclickClear = (model, inputsIds) => () => {
    inputsIds.forEach((inputId) => {
        document.getElementById(inputId).value = '';
    });
    onclickSubmit(model, inputsIds)();
};

const getUpperInputIds = (fields, pageFilteringTypes, filteringTypes) =>
    fields.map((f) => filedName2MatchFromType(f.name, pageFilteringTypes, filteringTypes));
const getLowerInputIds = (fields, pagesFilteringTypes, filteringTypes) => fields.map((f) =>
    filedName2ExcludeToType(f.name, pagesFilteringTypes, filteringTypes));

const filedName2MatchFromType = (fieldName, pageFilteringTypes, filteringTypes) => {
    if (pageFilteringTypes[fieldName] === filteringTypes.matchExcludeType) {
        return `${fieldName}-match`;
    } else if (pageFilteringTypes[fieldName] === filteringTypes.fromToType) {
        return `${fieldName}-from`;
    } else {
        throw 'probably incorrect configuration of filtering types';
    }
};

const filedName2ExcludeToType = (fieldName, pagesFilteringParams, filteringTypes) => {
    if (pagesFilteringParams[fieldName] === filteringTypes.matchExcludeType) {
        return `${fieldName}-exclude`;
    } else if (pagesFilteringParams[fieldName] === filteringTypes.fromToType) {
        return `${fieldName}-to`;
    } else {
        throw 'probably incorrect configuration of filtering types';
    }
};

/*
var list = document.querySelector('section');
var index;
var css;
var index2;

list.addEventListener('mouseenter', function(ev) {
  if (ev.target.tagName === 'SPAN') {
    console.log(ev.target);
    var rect = ev.target.getBoundingClientRect();
    var top = rect.top;
    var bottom = rect.bottom;
    var left = rect.right;
    
    css = document.getElementById('css');
    index = css.sheet.insertRule(`.tip span::before{left:${left - 50}px;top:${top}px}`, 0);
    index2 = css.sheet.insertRule(`.tip span::after{left:${left - 50}px;top:${top + 20}px}`, 0);
  } else if (css && css.sheet) {
   css.sheet.removeRule(index)
   css.sheet.removeRule(index2)
  }
}, true);4

*/