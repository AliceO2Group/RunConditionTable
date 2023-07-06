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

import filter from './table/filtering/filter.js';
import flagsIndexChip from './table/flagsIndexChip.js';

import { h, iconDataTransferDownload, iconReload, iconShareBoxed } from '/js/src/index.js';
import downloadCSV from '../../../../utils/csvExport.js';

import pageSettings from './pageSettings/pageSettings.js';
import flagsVisualization from './flags/flagsVisualization.js';
import flagsTable from './flags/flagsTable.js';

export default function flagsDataPanel(model) {
    const urlParams = model.router.getUrl().searchParams;

    const run = urlParams.get('run');
    const detector = urlParams.get('detector');

    const chips = [flagsIndexChip(model, 'run', run), flagsIndexChip(model, 'detector', detector)];

    const functionalities = (model) => h('.btn-group',
        h('button.btn.btn-secondary.icon-only-button', {
            onclick: () => {
                model.fetchedData.reqForData(true);
                model.notify();
            },
        }, iconReload()),

        h('button.btn.btn-secondary.icon-only-button', {
            onclick: () => {
                downloadCSV(model);
            },
        }, iconDataTransferDownload()),

        h('button.btn.btn-secondary.icon-only-button', {
            onclick: () => {
                navigator.clipboard.writeText(model.router.getUrl().toString())
                    .then(() => {
                    })
                    .catch(() => {
                    });
            },
        }, iconShareBoxed()),

        h('button.btn.icon-only-button', {
            className: model.searchFieldsVisible ? 'btn-primary' : 'btn-secondary',
            onclick: () => model.changeSearchFieldsVisibility(),
        }, model.searchFieldsVisible ? h('.slider-20-off-white.abs-center') : h('.slider-20-primary.abs-center')));

    return h('div.main-content', [
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-baseline',
                h('h3.p-left-15.text-primary', 'Flags'),
                h('h3.p-left-15.text-primary', run),
                h('h3.p-left-15.text-primary', detector),
                chips,
                h('button.btn.btn-secondary', {
                    onclick: () => {
                        document.getElementById('pageSettingsModal').style.display = 'block';
                        document.addEventListener('click', (event) => {
                            const modalContent = document.getElementsByClassName('modal-content');
                            const modal = document.getElementsByClassName('modal');
                            if (Array.from(modalContent).find((e) => e != event.target)
                            && Array.from(modal).find((e) => e == event.target)
                            && document.getElementById('pageSettingsModal')) {
                                document.getElementById('pageSettingsModal').style.display = 'none';
                            }
                        });
                    },
                }, h('.settings-20'))),

            h('div', functionalities(model))),
        model.searchFieldsVisible ? filter(model) : '',
        // AnyFiltersActive ? activeFilters(model) : '',

        flagsVisualization(model),
        flagsTable(model),
        h('.modal', { id: 'pageSettingsModal' },
            h('.modal-content.abs-center.p3', {
                id: 'pageSettingsModalContent',
            }, pageSettings(model, () => {
                document.getElementById('pageSettingsModal').style.display = 'none';
            }))),
    ]);
}
