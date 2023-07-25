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

import { h, iconDataTransferDownload, iconReload, iconShareBoxed } from '/js/src/index.js';
import filter from '../../userView/data/table/filtering/filter.js';
import downloadCSV from '../../../../utils/csvExport.js';
import pageSettings from '../../userView/data/pageSettings/pageSettings.js';
import flagsVisualization from '../../../components/flags/flagsVisualization.js';
import flagsTable from './flagsTable.js';
import flagBreadCrumbs from '../../../../components/flags/flagBreadcrumbs.js';
import { defaultRunNumbers } from '../../../../utils/defaults.js';
import noSubPageSelected from '../../userView/data/table/noSubPageSelected.js';

export default function flagsContent(model, runs, detectors, flags) {
    const urlParams = model.router.getUrl().searchParams;

    const dataPassName = urlParams.get('data_pass_name');
    const run = urlParams.get('run_numbers');
    const detector = urlParams.get('detector');

    const detectorName = detectors.getDetectorName(detector);
    const flagsData = flags.getFlags(run, detectorName);
    const runData = runs.getRun(dataPassName, run);

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
        }, h('.link-20-primary.abs-center')),

        h('button.btn.icon-only-button', {
            className: model.searchFieldsVisible ? 'btn-primary' : 'btn-secondary',
            onclick: () => model.changeSearchFieldsVisibility(),
        }, model.searchFieldsVisible ? h('.slider-20-off-white.abs-center') : h('.slider-20-primary.abs-center')));

    return run > defaultRunNumbers && runData
        ? h('div.main-content', [
            h('div.flex-wrap.justify-between.items-center',
                h('div.flex-wrap.justify-between.items-center',
                    flagBreadCrumbs(model, dataPassName, run, detectorName),
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

            flagsVisualization(runData, flagsData),
            flagsTable(model, flagsData),
            h('.modal', { id: 'pageSettingsModal' },
                h('.modal-content.abs-center.p3', {
                    id: 'pageSettingsModalContent',
                }, pageSettings(model, () => {
                    document.getElementById('pageSettingsModal').style.display = 'none';
                }))),
        ])
        : noSubPageSelected(model);
}
