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



import { h, iconHome, iconPerson, iconDataTransferDownload, iconMagnifyingGlass, iconReload } from '/js/src/index.js';
import downloadCSV from '../../utils/csvExport.js';
import {getPathElem} from "../../utils/utils.js";

export default function header(model) {
    return h('.flex-row.p2', [
        h('.w-50', [
            h('button.btn', iconHome()),
            ' ',
            h('button.btn', {
                onclick: () => model.logout()
            }, iconPerson()),
            ' ',
            h('span.f4.gray', 'Run Condition Table'),
        ]),
        h('.w-50', headerSpecific(model)),
        h('.w-10', functionalities(model)),
    ]);
}

const headerSpecific = (model) => {
    switch (getPathElem(model.router.getUrl().pathname, 1)) {
        case 'main': return title('Periods');
        case 'runsPerPeriod': return title('Runs per Period');
        case 'mc': return title('Monte Carlo');
        case 'flags': return title('Flags');
        default: return null;
    }
  };

const title = (text) => {
    return h('b.f4', text);
}

const functionalities = (model) => {
        return h('.button-group.text-right',
            // rowsOnPage(model),
            h('button.btn', {
                onclick: () => {
                    model.fetchedData.reqForData(true);
                    model.notify();
                }
            }, iconReload()),
            h('button.btn', {
                onclick: () => {
                    downloadCSV(model);
                }
            }, iconDataTransferDownload()),
            h('button.btn', {
                className: model.searchFieldsVisible? 'active': '',
                onclick: () => {
                    model.changeSearchFieldsVisibility();
                    model.notify();
                }
            }, iconMagnifyingGlass())
        );
}

const dropdownId = 'dropdown-rows-on-page-id';


const rowsOnPage = (model) => {
    return [
    h('button.btn', {
        onclick: () => {
            if (document.getElementById(dropdownId).classList.contains('dropdown-opened'))
                document.getElementById(dropdownId).classList.remove('dropdown-open');
            else document.getElementById(dropdownId).classList.toggle('dropdown-open');
    }}, 'rowsOnPage'),
    h('.dropdown', {
        id: dropdownId,
        name: 'section-object-dropdown'
    }, [
        h('.dropdown-menu', [
            h('button.btn', {
                onclick: (e) => {
                    model.fetchedData.rowsOnPage = 5;
                    model.router.params.rowsOnPage = 5;
                    model.router.handleLinkEvent(e);
                    // TODO
                    //model.notify();
                    //model.fetchedData.reqForData(true)
                    //model.notify();
                }
            }, '5'),
            h('button.btn', {
                onclick: () => {
                    model.fetchedData.rowsOnPage = 10;
                    model.fetchedData.reqForData(true)
                    model.notify();
                }
            }, '10'),
            h('button.btn', {
                onclick: () => {
                    model.fetchedData.rowsOnPage = 15;
                    model.fetchedData.reqForData(true)
                    model.notify();
                }
            }, '15'),
        ])
    ])
    ]
}
