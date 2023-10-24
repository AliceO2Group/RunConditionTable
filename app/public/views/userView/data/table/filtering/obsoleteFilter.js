/* eslint-disable no-console */
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
import { getFieldName } from '../../headersSpecials.js';
const RCT = window.RCT_CONF;
import { wrappedUserInput } from '../../../../../utils/filtering/filterUtils.js';
const { filterTypes } = RCT;

/**
 * Filtering panel
 * @deprecated
 * @param {DataAccessModel} model deprecated data access model
 * @returns {vnode} filter panel
 */
export default function filter(model) {
    const fieldSelectId = 'filter-field-select';
    const typeSelectId = 'filter-type-select';
    const leftInputId = 'filter-left-input';
    const rightInputId = 'filter-right-input';

    const dataPointer = model.getCurrentDataPointer();
    const { page } = dataPointer;
    const data = model.getCurrentData();
    const { fields } = data;
    const url = model.router.getUrl();

    function onFilteringTypeChange() {
        const filteringTypeSelect = document.getElementById(typeSelectId);
        const selectedType = filteringTypeSelect.options[filteringTypeSelect.selectedIndex].value;
        const types = selectedType == filterTypes.between ? ['from', 'to'] : [filterTypes.match, filterTypes.exclude];

        const leftFilterPlaceholder = document.getElementById('left-filter-placeholder');
        const rightFilterPlaceholder = document.getElementById('right-filter-placeholder');
        [leftFilterPlaceholder.innerHTML, rightFilterPlaceholder.innerHTML] = types;
    }

    function clearUserInput() {
        document.getElementById(fieldSelectId).value = '';
        document.getElementById(typeSelectId).value = '';
        document.getElementById(leftInputId).value = '';
        document.getElementById(rightInputId).value = '';
    }

    function onFilterSubmit() {
        const filteringTypeSelect = document.getElementById(typeSelectId);
        const selectedType = filteringTypeSelect.options[filteringTypeSelect.selectedIndex].value;

        const fieldNameSelect = document.getElementById(fieldSelectId);
        const fieldNameValue = fieldNameSelect.options[fieldNameSelect.selectedIndex].value;

        const leftFilterType = document.getElementById('left-filter-placeholder').innerHTML;
        const rightFilterType = document.getElementById('right-filter-placeholder').innerHTML;

        const leftFilterInput = document.getElementById(leftInputId).value;
        const rightFilterInput = document.getElementById(rightInputId).value;

        let filterPhrase = '';
        if (selectedType == filterTypes.between) {
            const betweenPhrase = `${fieldNameValue}-${selectedType}=${leftFilterInput},${rightFilterInput}`;
            const betweenFilterPhrase = `&${encodeURI(betweenPhrase)}`;
            if (! url.href.includes(betweenFilterPhrase)) {
                filterPhrase += betweenFilterPhrase;
            }
        } else {
            const wrappedLeftInput = wrappedUserInput(leftFilterInput, fieldNameValue, page);
            const matchPhrase = leftFilterInput ? `${fieldNameValue}-${leftFilterType}=${wrappedLeftInput}` : '';
            const matchFilterPhrase = `&${encodeURI(matchPhrase)}`;

            const wrappedRightInput = wrappedUserInput(rightFilterInput, fieldNameValue, page);
            const excludePhrase = rightFilterInput ? `${fieldNameValue}-${rightFilterType}=${wrappedRightInput}` : '';
            const excludeFilterPhrase = `&${encodeURI(excludePhrase)}`;

            if (! url.href.includes(matchFilterPhrase)) {
                filterPhrase += matchFilterPhrase;
            }

            if (! url.href.includes(excludeFilterPhrase)) {
                filterPhrase += excludeFilterPhrase;
            }
        }

        const newUrl = new URL(`${url.href}${filterPhrase}`);

        clearUserInput();
        model.router.go(newUrl);
    }

    const aggregatedFiltersTypes = `${filterTypes.match}-${filterTypes.exclude}`;

    return h('.font-size-small', [
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                h('h5', 'Filter data'),
                h('button.btn.btn-secondary', {
                    onclick: () => onFilterSubmit(),
                }, 'Use defined filters'))),
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                h('select.select', {
                    id: fieldSelectId,
                    name: 'showOptions' }, [
                    h('option', { value: '', selected: true, disabled: true, hidden: true }, 'Field'),
                    fields.filter((field) => getFieldName(model, field))
                        .map((field) => h('option', { value: field.name }, getFieldName(model, field))),
                ], h('.close-10-primary')),

                h('select.select', {
                    id: typeSelectId,
                    name: 'showOptions',
                    onchange: () => onFilteringTypeChange(),
                }, [
                    h('option', { value: '', selected: true, disabled: true, hidden: true }, 'Filtering type'),
                    h('option', { value: aggregatedFiltersTypes }, aggregatedFiltersTypes),
                    h('option', { value: filterTypes.between }, filterTypes.between),
                ], h('.close-10-primary')),

                h('.text-field',
                    h('input.form-control.relative', {
                        style: 'width:120px',
                        type: 'text',
                        value: document.getElementById(typeSelectId)?.options[Selection.selectedIndex]?.value,
                        disabled: false,
                        id: leftInputId,
                        required: true,
                        // TODO: pattern
                    }),
                    h('span.placeholder', { id: 'left-filter-placeholder' }, 'match/from')),

                h('.text-field',
                    h('input.form-control.relative', {
                        style: 'width:120px',
                        type: 'text',
                        value: '',
                        disabled: false,
                        id: rightInputId,
                        required: true,
                        // TODO: pattern
                    }),
                    h('span.placeholder', { id: 'right-filter-placeholder' }, 'to/exclude')),

                h('button.btn.btn-primary', {
                    onclick: () => onFilterSubmit(),
                }, 'Filter'),

                h('button.btn.btn-secondary.icon-only-button', {
                    onclick: () => onFilterSubmit(),
                }, h('.save-20-primary')))),
    ]);
}
