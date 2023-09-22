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
import obsoleteDownloadCSV from '../../utils/obsoleteCsvExport.js';
import copyLinkButton from './copyLinkButton.js';
import { modalIds, showModal } from '../../views/modal/modal.js';

export const dataActions = {
    hide: 'Hide',
    obsoleteHide: 'Hide (obsolete)',
    reload: 'Reload',
    obsoleteDownloadCSV: 'Download CSV (obsolete)',
    downloadCSV: 'Download CSV',
    copyLink: 'Copy link',
    showFilteringPanel: 'Filter',
    obsoleteShowFilteringPanel: 'Filter (obsolete)',
};

/**
 *
 * @param {DataAccessModel} model data access model (obsolete)
 * @param {Object} applicableDataActions object
 * @param {OverviewModel} dataModel - data model (e.g. periodsModel)
 * @returns {vnode}
 */

export default function dataActionButtons(model, applicableDataActions, dataModel = null) {
    return h('.btn-group',
        applicableDataActions[dataActions.reload]
            ? h('button.btn.btn-secondary.icon-only-button', {
                onclick: () => {
                    model.fetchedData.reqForData(true);
                    model.notify();
                },
            }, iconReload())
            : '',

        applicableDataActions[dataActions.obsoleteDownloadCSV]
            ? h('button.btn.btn-secondary.icon-only-button', {
                onclick: () => {
                    obsoleteDownloadCSV(model);
                },
            }, iconDataTransferDownload())
            : '',

        applicableDataActions[dataActions.downloadCSV]
            ? h('button.btn.btn-secondary.icon-only-button', {
                onclick: () => {
                    showModal(modalIds.dataExport.modal);
                },
            }, iconDataTransferDownload())
            : '',

        applicableDataActions[dataActions.copyLink]
            ? copyLinkButton(model.router.getUrl().toString())
            : '',

        applicableDataActions[dataActions.obsoleteHide]
            ? h('button.btn.icon-only-button', {
                className: model.hideCurrentPageMarkedRows ? 'btn-primary' : 'btn-secondary',
                onclick: () => {
                    model.changeMarkedRowsVisibility();
                },
            }, model.hideCurrentPageMarkedRows ? h('.hide-20-off-white.abs-center') : h('.hide-20-primary.abs-center'))
            : '',

        applicableDataActions[dataActions.hide] && dataModel
            ? h('button.btn.icon-only-button', {
                className: dataModel.shouldHideSelectedRows ? 'btn-primary' : 'btn-secondary',
                onclick: () => {
                    dataModel.toggleSelectedRowsVisibility();
                },
            }, dataModel.shouldHideSelectedRows ? h('.hide-20-off-white.abs-center') : h('.hide-20-primary.abs-center'))
            : '',

        applicableDataActions[dataActions.obsoleteShowFilteringPanel]
            ? h('button.btn.icon-only-button', {
                className: model.showFilteringPanel ? 'btn-primary' : 'btn-secondary',
                onclick: () => model.changeSearchFieldsVisibility(),
            }, model.showFilteringPanel ? h('.slider-20-off-white.abs-center') : h('.slider-20-primary.abs-center'))
            : '',

        applicableDataActions[dataActions.showFilteringPanel] && dataModel
            ? h('button.btn.icon-only-button', {
                className: dataModel.filterPanelVisible ? 'btn-primary' : 'btn-secondary',
                onclick: () => dataModel.toggleFilterPanelVisibility(),
            }, dataModel.filterPanelVisible ? h('.slider-20-off-white.abs-center') : h('.slider-20-primary.abs-center'))
            : '');
}
