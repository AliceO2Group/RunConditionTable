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
    const fields = model.visibleFields;
    const aggregatedFiltersTypes = `${filterTypes.match}-${filterTypes.exclude}`;

    return h('.font-size-small', [
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                h('h5', 'Filter data'),
                h('button.btn.btn-secondary', {
                    onclick: () => {},
                }, 'Use defined filters'))),
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                h('select.select', {
                    id: 'show-options-field',
                    name: 'showOptions' }, [
                    h('option', {
                        value: '',
                        selected: true,
                        disabled: true,
                        hidden: true,
                    }, 'Field'),
                    fields.map((field) => h('option', { value: field.name }, field.fieldName)),
                ], h('.close-10-primary')),

                h('select.select', {
                    id: 'filters-opts-select',
                    name: 'showOptions',
                    onchange: () => {},
                }, [
                    h('option', { value: '', selected: true, disabled: true, hidden: true }, 'Filtering type'),
                    h('option', { value: aggregatedFiltersTypes }, aggregatedFiltersTypes),
                    h('option', { value: filterTypes.between }, filterTypes.between),
                ], h('.close-10-primary')),

                h('.text-field',
                    h('input.form-control.relative', {
                        style: 'width:120px',
                        type: 'text',
                        value: document.getElementById('filters-opts-select')?.options[Selection.selectedIndex]?.value,
                        disabled: false,
                        id: 'left-filter-input',
                        required: true,
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
                    }),
                    h('span.placeholder', { id: 'right-filter-placeholder' }, 'to/exclude')),

                h('button.btn.btn-primary', {
                    onclick: () => {},
                }, 'Filter'),

                h('button.btn.btn-secondary.icon-only-button', {
                    onclick: () => {},
                }, h('.save-20-primary')))),
    ]);
}
