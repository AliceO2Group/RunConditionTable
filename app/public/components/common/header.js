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

import { h, iconHome, iconPerson, iconDataTransferDownload, iconReload } from '/js/src/index.js';
import downloadCSV from '../../utils/csvExport.js';

export default function header(model) {
    return h('',
        h('.header-specific', headerSpecific(model)),
        h('.flex-row.p2', [
            h('.w-50', [
                h('button.btn.btn-primary', iconHome()),
                ' ',
                h('button.btn', {
                    onclick: () => model.logout(),
                }, iconPerson()),
                ' ',
                h('span.f4.gray', {
                    onclick: () => model.router.go('/', true),
                }, 'Run Condition Table'),
            ]),
            h('.w-50', functionalities(model)),
        ]));
}

const headerSpecific = (model) => {
    const { page, index } = model.getCurrentDataPointer();
    switch (page) {
        case 'periods': return title('Periods');
        case 'runsPerPeriod': return title(`Runs per period: ${index}`);
        case 'runsPerDataPass': return title(`Runs per data pass: ${index}`);
        case 'dataPasses': return title(`Data passes per period: ${index}`);
        case 'mc': return title(`Monte Carlo: period ${index}`);
        case 'flags': return title(`Flags: run number ${index}`);
        default: return null;
    }
};

const title = (text) => h('b.f4', text);

const functionalities = (model) => h('.button-group.text-right',
    h('button.btn', {
        onclick: () => {
            model.fetchedData.reqForData(true);
            model.notify();
        },
    }, iconReload()),

    h('button.btn', {
        onclick: () => {
            downloadCSV(model);
        },
    }, iconDataTransferDownload()),

    h('button.btn.filter-button', {
        className: model.searchFieldsVisible ? 'selected' : '',
        onclick: () => model.changeSearchFieldsVisibility(),
    }, h('.filter-20.icon')));
