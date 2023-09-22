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
import { RCT } from '../../config.js';
const { filterTypes } = RCT;

/**
 * Filtering panel
 * @param {OverviewModel} model model implementing the OverviewModel interface (e.g. PeriodsModel)
 * @returns {vnode} filter panel
 */
export default function filteringPanel(model) {
    const fieldSelectId = 'filter-field-select';
    const typeSelectId = 'filter-type-select';
    const leftInputId = 'filter-left-input';
    const rightInputId = 'filter-right-input';

    const fields = model.visibleFields;
    const aggregatedFiltersTypes = `${filterTypes.match}-${filterTypes.exclude}`;

    const onFilteringTypeChange = () => {
        const filteringTypeSelect = document.getElementById(typeSelectId);
        const selectedType = filteringTypeSelect.options[filteringTypeSelect.selectedIndex].value;
        const types = selectedType == filterTypes.between ? ['from', 'to'] : [filterTypes.match, filterTypes.exclude];

        const leftFilterPlaceholder = document.getElementById('left-filter-placeholder');
        const rightFilterPlaceholder = document.getElementById('right-filter-placeholder');
        [leftFilterPlaceholder.innerHTML, rightFilterPlaceholder.innerHTML] = types;
    };

    const clearUserInput = () => {
        document.getElementById(fieldSelectId).value = '';
        document.getElementById(typeSelectId).value = '';
        document.getElementById(leftInputId).value = '';
        document.getElementById(rightInputId).value = '';
    };

    const onFilterSubmit = async () => {
        const fieldNameSelect = document.getElementById(fieldSelectId);
        const fieldNameValue = fieldNameSelect.options[fieldNameSelect.selectedIndex].value;

        const leftFilterType = document.getElementById('left-filter-placeholder').innerHTML;
        const rightFilterType = document.getElementById('right-filter-placeholder').innerHTML;

        const leftFilterInput = document.getElementById(leftInputId).value;
        const rightFilterInput = document.getElementById(rightInputId).value;

        if (rightFilterInput) {
            model.filtering.addFilter(fieldNameValue, rightFilterInput, rightFilterType);
        }

        if (leftFilterInput) {
            model.filtering.addFilter(fieldNameValue, leftFilterInput, leftFilterType);
        }

        clearUserInput();
    };

    const fieldSelect = h('select.select', {
        id: fieldSelectId,
        name: 'showOptions' }, [
        h('option', {
            value: '',
            selected: true,
            disabled: true,
            hidden: true,
        }, 'Field'),
        fields.map((field) => h('option', { value: field.name }, field.fieldName)),
    ], h('.close-10-primary'));

    const typeSelect = h('select.select', {
        id: typeSelectId,
        name: 'showOptions',
        onchange: () => onFilteringTypeChange(),
    }, [
        h('option', { value: '', selected: true, disabled: true, hidden: true }, 'Filtering type'),
        h('option', { value: aggregatedFiltersTypes }, aggregatedFiltersTypes),
        h('option', { value: filterTypes.between }, filterTypes.between),
    ], h('.close-10-primary'));

    const leftInput = h('.text-field',
        h('input.form-control.relative', {
            style: 'width:120px',
            type: 'text',
            value: document.getElementById(typeSelectId)?.options[Selection.selectedIndex]?.value,
            disabled: false,
            id: leftInputId,
            required: true,
        }),
        h('span.placeholder', { id: 'left-filter-placeholder' }, 'match/from'));

    const rightInput = h('.text-field',
        h('input.form-control.relative', {
            style: 'width:120px',
            type: 'text',
            value: '',
            disabled: false,
            id: rightInputId,
            required: true,
        }),
        h('span.placeholder', { id: 'right-filter-placeholder' }, 'to/exclude'));

    return h('.font-size-small', [
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                h('h5', 'Filter data'),
                h('button.btn.btn-secondary', {
                    onclick: () => {},
                }, 'Use defined filters'))),
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                fieldSelect,
                typeSelect,
                leftInput,
                rightInput,

                h('button.btn.btn-primary', {
                    onclick: () => onFilterSubmit(),
                }, 'Filter'),

                h('button.btn.btn-secondary.icon-only-button', {
                    disabled: true,
                }, h('.save-20-primary')))),
    ]);
}
