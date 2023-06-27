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
import { getHeaderSpecial } from '../headersSpecials.js';
import { RCT } from '../../../../config.js';

const { dataReqParams } = RCT;

export default function filter(model) {
    const data = model.getCurrentData();
    const dataPointer = model.getCurrentDataPointer();
    const { fields } = data;

    function onFilteringTypeChange() {
        const filteringTypeSelect = document.getElementById('showOptionsType');
        const selectedValue = filteringTypeSelect.options[filteringTypeSelect.selectedIndex].value;
        const types = selectedValue.split('-');

        const matchFromPlaceholder = document.getElementById('match-from-placeholder');
        const excludeToPlaceholder = document.getElementById('exclude-to-placeholder');
        [matchFromPlaceholder.innerHTML, excludeToPlaceholder.innerHTML] = types;
    }

    function onFilterSubmit() {
        const fieldNameSelect = document.getElementById('showOptionsField');
        const fieldNameValue = fieldNameSelect.options[fieldNameSelect.selectedIndex].value;

        const matchFromType = document.getElementById('match-from-placeholder').innerHTML;
        const excludeToType = document.getElementById('exclude-to-placeholder').innerHTML;

        const matchFromInput = document.getElementById('match-from-input').value;
        const excludeToInput = document.getElementById('exclude-to-input').value;

        // eslint-disable-next-line no-console
        console.log(fieldNameValue);
        // eslint-disable-next-line no-console
        console.log(matchFromType);
        // eslint-disable-next-line no-console
        console.log(matchFromInput);
        // eslint-disable-next-line no-console
        console.log(excludeToInput);

        let matchFromPhrase = '';
        let excludeToPhrase = '';
        if (matchFromInput) {
            matchFromPhrase = `${encodeURI(fieldNameValue)}-${encodeURI(matchFromType)}=${encodeURI(matchFromInput)}`;
        }
        if (excludeToInput) {
            excludeToPhrase = `${encodeURI(fieldNameValue)}-${encodeURI(excludeToType)}=${encodeURI(excludeToInput)}`;
        }

        const url = model.router.getUrl();
        const newUrl = new URL(`${url.href}`
            + `${matchFromPhrase ? `&${matchFromPhrase}` : ''}`
            + `${excludeToPhrase ? `&${excludeToPhrase}` : ''}`);

        // eslint-disable-next-line no-console
        console.log(newUrl);

        // Model.router.go(newUrl);
    }

    function onClear() {
        // eslint-disable-next-line max-len
        model.router.go(`/?page=${dataPointer.page}&index=${dataPointer.index}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-name`);
    }

    return h('.filter-panel', [
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-center',
                h('h5', 'Filter data'),
                h('button.btn.btn-secondary', {
                    onclick: () => onFilterSubmit(),
                }, 'Use defined filters'))),
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-center',
                h('select.select.filter-select', {
                    id: 'showOptionsField',
                    name: 'showOptions' }, [
                    h('option', { value: '', selected: true, disabled: true, hidden: true }, 'Field'),
                    fields.map((field) => h('option', { value: field.name }, getHeaderSpecial(model, field))),
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
                        id: 'match-from-input',
                        required: true,
                        // TODO: pattern
                    }),
                    h('span.placeholder', { id: 'match-from-placeholder' }, 'match/from')),

                h('.text-field',
                    h('input.form-control.relative', {
                        style: 'width:120px',
                        type: 'text',
                        value: '',
                        disabled: false,
                        id: 'exclude-to-input',
                        required: true,
                        // TODO: pattern
                    }),
                    h('span.placeholder', { id: 'exclude-to-placeholder' }, 'to/exclude')),

                h('button.btn.btn-primary', {
                    onclick: () => onFilterSubmit(),
                }, 'Filter'),

                h('button.btn.btn-secondary.icon-only-button', {
                    onclick: () => onFilterSubmit(),
                }, h('.save-20')))),

        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-center',
                h('h5', 'Active filters'),
                h('button.btn.btn-secondary', {
                    onclick: () => onClear(),
                }, 'Clear all'))),
        h('.flex-wrap.items-center.chips',
            h('div.chip.filter-chip.inline',
                h('.filter-field.inline', 'name'),
                h('.filter-type.inline', 'match'),
                h('.filter-input.inline', 'LHC'),
                dataPointer.index,
                h('.close-10'))
            ,
            h('div.chip.filter-chip.inline',
                dataPointer.index,
                h('.close-10'))
            ,
            h('div.chip.filter-chip.inline',
                dataPointer.index,
                h('.close-10'))
            ,
            h('div.chip.filter-chip.inline',
                dataPointer.index,
                h('.close-10'))),

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
         */
    ]);
}
