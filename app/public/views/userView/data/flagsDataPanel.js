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

import { h, iconDataTransferDownload, iconReload } from '/js/src/index.js';
import filter from './table/filtering/filter.js';

import downloadCSV from '../../../../utils/csvExport.js';

import flagsVisualization from '../../flags/flagsVisualization.js';
import flagsTable from '../../flags/flagsTable.js';
import flagBreadCrumbs from '../../../components/common/flagBreadcrumbs.js';
import detectorName from './flags/detectorName.js';
import copyLinkButton from '../../../components/buttons/copyLinkButton.js';

export default function flagsDataPanel(model) {
    const urlParams = model.router.getUrl().searchParams;

    const dataPassName = urlParams.get('data_pass_name');
    const run = urlParams.get('run_numbers');
    const detector = urlParams.get('detector');

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

        copyLinkButton(model.router.getUrl().toString()),

        h('button.btn.icon-only-button', {
            className: model.searchFieldsVisible ? 'btn-primary' : 'btn-secondary',
            onclick: () => model.changeSearchFieldsVisibility(),
        }, model.searchFieldsVisible ? h('.slider-20-off-white.abs-center') : h('.slider-20-primary.abs-center')));

    return h('.p-1em', [
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                flagBreadCrumbs(model, dataPassName, run, detectorName(detector))),

            functionalities(model)),
        model.searchFieldsVisible ? filter(model) : '',

        flagsVisualization(model, dataPassName, run, detectorName(detector)),
        flagsTable(model, run, detectorName(detector)),
    ]);
}
