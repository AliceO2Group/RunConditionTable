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
import { RCT } from '../../../../../config.js';
const { filterTypes } = RCT;

export default function filter(model) {
    const data = model.getCurrentData();
    const { fields } = data;

    function onFilteringTypeChange() {
        const filteringTypeSelect = document.getElementById('showOptionsType');
        const selectedValue = filteringTypeSelect.options[filteringTypeSelect.selectedIndex].value;
        const types = selectedValue.split('-');

        const leftFilterPlaceholder = document.getElementById('left-filter-placeholder');
        const rightFilterPlaceholder = document.getElementById('right-filter-placeholder');
        [leftFilterPlaceholder.innerHTML, rightFilterPlaceholder.innerHTML] = types;
    }

    function onFilterSubmit() {
        const fieldNameSelect = document.getElementById('show-options-field');
        const fieldNameValue = fieldNameSelect.options[fieldNameSelect.selectedIndex].value;

        const leftFilterType = document.getElementById('left-filter-placeholder').innerHTML;
        const rightFilterType = document.getElementById('right-filter-placeholder').innerHTML;

        const leftFilterInput = document.getElementById('left-filter-input').value;
        const rightFilterInput = document.getElementById('right-filter-input').value;

        // eslint-disable-next-line no-console
        console.log({
            fieldNameValue,

            rightFilterType,
            rightFilterInput,

            leftFilterType,
            leftFilterInput,
        });

        let filterPhrase = '';
        if (leftFilterType === filterTypes.from && rightFilterType === filterTypes.to) {
            const fromToFilterType = `${filterTypes.from}_${filterTypes.to}`;
            // eslint-disable-next-line max-len
            filterPhrase += `&${encodeURI(fieldNameValue)}-${encodeURI(fromToFilterType)}=${encodeURI(leftFilterInput)},${encodeURI(rightFilterInput)}`;
        } else {
            // eslint-disable-next-line max-len
            filterPhrase += leftFilterInput ? `&${encodeURI(fieldNameValue)}-${encodeURI(leftFilterType)}=${encodeURI(leftFilterInput)}` : '';
            filterPhrase += rightFilterInput ? `&${encodeURI(fieldNameValue)}-${encodeURI(rightFilterType)}=${encodeURI(rightFilterInput)}` : '';
        }

        /*
         * Let matchFromPhrase = '';
         * let excludeToPhrase = '';
         * if (rightFilterInput) {
         *     matchFromPhrase = `${encodeURI(fieldNameValue)}-${encodeURI(rightFilterType)}=${encodeURI(rightFilterInput)}`;
         * }
         * if (leftFilterInput) {
         *     excludeToPhrase = `${encodeURI(fieldNameValue)}-${encodeURI(leftFilterType)}=${encodeURI(leftFilterInput)}`;
         * }
         */

        const url = model.router.getUrl();
        const newUrl = new URL(`${url.href}${filterPhrase}`);
        // eslint-disable-next-line no-console
        console.log(newUrl);

        model.router.go(newUrl);
    }

    return h('.font-size-small', [
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-center',
                h('h5', 'Filter data'),
                h('button.btn.btn-secondary', {
                    onclick: () => onFilterSubmit(),
                }, 'Use defined filters'))),
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-center',
                h('select.select.filter-select', {
                    id: 'show-options-field',
                    name: 'showOptions' }, [
                    h('option', { value: '', selected: true, disabled: true, hidden: true }, 'Field'),
                    fields.filter((field) => getFieldName(model, field))
                        .map((field) => h('option', { value: field.name }, getFieldName(model, field))),
                ], h('.close-10')),

                h('select.select.filter-select', {
                    id: 'showOptionsType',
                    name: 'showOptions',
                    onchange: () => onFilteringTypeChange(),
                }, [
                    h('option', { value: '', selected: true, disabled: true, hidden: true }, 'Filtering type'),
                    h('option', { value: 'match-exclude' }, 'match-exclude'),
                    h('option', { value: 'from-to' }, 'from-to'),
                ], h('.close-10')),

                h('.text-field',
                    h('input.form-control.relative', {
                        style: 'width:120px',
                        type: 'text',
                        value: document.getElementById('showOptionsType')?.options[Selection.selectedIndex]?.value,
                        disabled: false,
                        id: 'left-filter-input',
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
                        id: 'right-filter-input',
                        required: true,
                        // TODO: pattern
                    }),
                    h('span.placeholder', { id: 'right-filter-placeholder' }, 'to/exclude')),

                h('button.btn.btn-primary', {
                    onclick: () => onFilterSubmit(),
                }, 'Filter'),

                h('button.btn.btn-secondary.icon-only-button', {
                    onclick: () => onFilterSubmit(),
                }, h('.save-20')))),
    ]);
}
