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
import { getHeaderSpecial } from '../headersSpecials.js';

const { dataReqParams } = RCT;

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

    return h('div.sticky', [
        h('div.x-scrollable',
            h('table',
                h('tbody',
                    labelsRow(model, fields),
                    inputsRow(params, upperInputIds),
                    inputsRow(params, lowerInputIds))),
            h('div.abs',
                h('button.btn', {
                    onclick: onclickSubmit(model, inputsIds),
                }, 'Submit'),
                '  ',
                h('button.btn', {
                    onclick: onclickClear(model, inputsIds),
                }, 'Clear filters'),
                '     ',
                h('button.btn', {
                    onclick: () => {
                        // eslint-disable-next-line no-return-assign
                        data.fields.forEach((f) => f.marked = true);
                        model.notify();
                    },
                }, 'Show all columns'),
                '  ',
                h('button.btn', {
                    onclick: () => data.fields.forEach((f) => {
                        model.fetchedData.changeItemStatus(
                            f,
                            data.rows.some((r) => r[f.name]),
                        );
                        model.notify();
                    }),
                }, 'Hide empty columns'))),
    ]);
}

const labelsRow = (model, fields) => h('tr',
    fields.map((field) => createClickableLabel(model, field)));

const inputsRow = (params, inputsIds) => h('tr',
    inputsIds.map((id) => createInputField(id, params[id])));

const createClickableLabel = (model, field) =>
    h('th.tooltip.noBorderBottom.table-cell-like',
        h('button.btn', {
            style: 'width:120px',
            onclick: () => model.fetchedData.changeItemStatus(field),
            className: field.marked ? 'active' : '',
        }, getHeaderSpecial(model, field),
        h('span.tooltiptext', field.marked ? 'hide' : 'display')));

const createInputField = (inputId, currentValue) => {
    const type = inputId.substring(inputId.indexOf('-') + 1);
    return type !== 'undefined' ?
    h('th.noBorderBottom.table-cell-like',
            h('input.form-control.rel', {
                style: 'width:120px',
                type: 'text',
                value: currentValue ? currentValue : '',
                disabled: type == null,
                id: inputId,
                placeholder: `${type}`,
            }
            )) : '';
};
const onclickSubmit = (model, inputsIds) => () => {
    const filteringParamsPhrase = inputsIds
        .map((inputId) => [
            inputId,
            encodeURI(document.getElementById(inputId)?.value || ''),
        ])
        .filter(([_, v]) => v?.length > 0)
        .map(([id, v]) => `${id}=${v}`)
        .join('&');

    const { params } = model.router;
    const newSearch =
    `?page=${params.page}&index=${params.index}` +
    `&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&${filteringParamsPhrase}`;

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
        return 'undefined';
    }
};

const filedName2ExcludeToType = (fieldName, pagesFilteringParams, filteringTypes) => {
    if (pagesFilteringParams[fieldName] === filteringTypes.matchExcludeType) {
        return `${fieldName}-exclude`;
    } else if (pagesFilteringParams[fieldName] === filteringTypes.fromToType) {
        return `${fieldName}-to`;
    } else {
        return 'undefined';
    }
};
