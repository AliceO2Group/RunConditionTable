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
import downloadCSV from '../../utils/csvExport.js';
import copyLinkButton from './copyLinkButton.js';

export const dataActions = {
    hide: 'Hide',
    reload: 'Reload',
    downloadCSV: 'Download CSV',
    copyLink: 'Copy link',
    showFilteringPanel: 'Filter',
};

export default function dataActionButtons(model, applicableDataActions) {
    return h('.btn-group',
        applicableDataActions[dataActions.reload]
            ? h('button.btn.btn-secondary.icon-only-button', {
                onclick: () => {
                    model.fetchedData.reqForData(true);
                    model.notify();
                },
            }, iconReload())
            : '',

        applicableDataActions[dataActions.downloadCSV]
            ? h('button.btn.btn-secondary.icon-only-button', {
                onclick: () => {
                    downloadCSV(model);
                },
            }, iconDataTransferDownload())
            : '',

        applicableDataActions[dataActions.copyLink]
            ? copyLinkButton(model.router.getUrl().toString())
            : '',

        applicableDataActions[dataActions.hide]
            ? h('button.btn.icon-only-button', {
                className: model.hideCurrentPageMarkedRows ? 'btn-primary' : 'btn-secondary',
                onclick: () => model.changeMarkedRowsVisibility(),
            }, model.hideCurrentPageMarkedRows ? h('.hide-20-off-white.abs-center') : h('.hide-20-primary.abs-center'))
            : '',

        applicableDataActions[dataActions.showFilteringPanel]
            ? h('button.btn.icon-only-button', {
                className: model.showFilteringPanel ? 'btn-primary' : 'btn-secondary',
                onclick: () => model.changeSearchFieldsVisibility(),
            }, model.showFilteringPanel ? h('.slider-20-off-white.abs-center') : h('.slider-20-primary.abs-center'))
            : '');
}