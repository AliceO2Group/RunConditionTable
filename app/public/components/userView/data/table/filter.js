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

    return h('.filter-panel', [
        h('.filter-panel-content',
            h('table.no-spacing',
                h('tbody.zeropadding',
                    labelsRow(model, fields),
                    inputsRow(params, upperInputIds, fields),
                    inputsRow(params, lowerInputIds, fields))),
            /*
             *H('.filter-panel-buttons',
             *    h('button.btn.filter-btn', {
             *        onclick: onclickClear(model, inputsIds),
             *    }, h('.clear-filters-20.vertical-center'), h('.icon-btn-text', 'Clear filters')),
             *    '  ',
             *    h('button.btn.filter-btn', {
             *        onclick: () => {
             *            for (const field of data.fields) {
             *                field.marked = true;
             *            }
             *            model.notify();
             *        },
             *    }, 'Show all columns'),
             *    '  ',
             *    h('button.btn.filter-btn', {
             *        onclick: () => data.fields.forEach((f) => {
             *            model.fetchedData.changeItemStatus(
             *                f,
             *                data.rows.some((r) => r[f.name]),
             *            );
             *            model.notify();
             *        }),
             *    }, h('.hide-empty-20.vertical-center'), h('.icon-btn-text', 'Hide empty columns')),
             *    '  ',
             *    h('button.btn.btn-primary.filter-btn', {
             *        onclick: onclickSubmit(model, inputsIds),
             *    }, 'Submit'))
             */),
    ]);
}

const labelsRow = (model, fields) => h('tr.br-top-10',
    fields.map((field) => createClickableLabel(model, field)));

const inputsRow = (params, inputsIds, fields) => h('tr.br-bottom-10',
    inputsIds.map((id) => createInputField(id, params[id], fields)));

const createClickableLabel = (model, field) =>
    h(`th.tooltip.noBorderBottom.table-cell-like.${field.name}-class.br-top-10`,
        { className: field.marked ? 'active' : '' },
        h('.clickable-label', {
            style: 'width:120px',
            onclick: () => {
                model.fetchedData.changeItemStatus(field);
                if (field.marked) {
                    for (const element of document.getElementsByClassName(`${field.name}-class`)) {
                        element.classList.add('active');
                    }
                } else {
                    for (const element of document.getElementsByClassName(`${field.name}-class`)) {
                        if (element.classList.contains('active')) {
                            element.classList.remove('active');
                        }
                    }
                }
            },
            className: field.marked ? 'active' : '',
        },
        getHeaderSpecial(model, field),
        h('span.tooltiptext', field.marked ? 'hide' : 'display')));

const createInputField = (inputId, currentValue, fields) => {
    const type = inputId.substring(inputId.indexOf('-') + 1);
    return type !== 'undefined' ?
        h(`th.noBorderBottom.table-cell-like.${inputId.substring(0, inputId.indexOf('-'))}-class${
            ['to', 'exclude'].includes(inputId.substring(inputId.indexOf('-') + 1)) ? '.br-bottom-10' : ''}`,
        { className: `${isFieldMarked(inputId, fields) ? 'active' : ''}` },
        h('.text-field',
            h('input.form-control.relative', {
                style: 'width:120px',
                type: 'text',
                value: currentValue ? currentValue : '',
                disabled: type == null,
                id: inputId,
                required: true,
                // TODO: pattern
            }), h('span.placeholder', type))) : '';
};

const isFieldMarked = (inputId, fields) => {
    for (const field of fields) {
        if (field.name === `${inputId.substring(0, inputId.indexOf('-'))}`) {
            return field.marked;
        }
    }
    return false;
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
        const element = document.getElementById(inputId);
        if (element) {
            element.value = '';
        }
    });
    onclickSubmit(model, inputsIds)();
};

const getUpperInputIds = (fields, pageFilteringTypes, filteringTypes) =>
    fields.map((f) => fieldName2MatchFromType(f.name, pageFilteringTypes, filteringTypes));

const getLowerInputIds = (fields, pagesFilteringTypes, filteringTypes) => fields.map((f) =>
    fieldName2ExcludeToType(f.name, pagesFilteringTypes, filteringTypes));

const fieldName2MatchFromType = (fieldName, pageFilteringTypes, filteringTypes) => {
    if (pageFilteringTypes[fieldName] === filteringTypes.matchExcludeType) {
        return `${fieldName}-match`;
    } else if (pageFilteringTypes[fieldName] === filteringTypes.fromToType) {
        return `${fieldName}-from`;
    } else {
        return 'undefined';
    }
};

const fieldName2ExcludeToType = (fieldName, pagesFilteringParams, filteringTypes) => {
    if (pagesFilteringParams[fieldName] === filteringTypes.matchExcludeType) {
        return `${fieldName}-exclude`;
    } else if (pagesFilteringParams[fieldName] === filteringTypes.fromToType) {
        return `${fieldName}-to`;
    } else {
        return 'undefined';
    }
};
