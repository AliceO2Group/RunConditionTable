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
import messagePanel from './messagePanel.js';
import spinner from '../common/spinner.js';

const goBack = 'Go back';
const nothingFound = 'Nothing found';

/**
 * Uses deprecated data request.
 * Please use the `requestButton` with the specific dataModel (e.g. `periodsModel`) instead.
 * @deprecated
 * @param {DataAccessModel} model dataAccessModel
 * @returns {button} button that enables user to request data
 */
const obsoleteRequestButton = (model) => h('button.btn.btn-primary.m3', {
    onclick: () => model.fetchedData.reqForData(true),
}, 'Reload');

const requestButton = (dataModel) => h('button.btn.btn-primary.m3', {
    onclick: () => dataModel.fetchCurrentPageData(),
}, 'Reload');

const removeCurrentDataButton = (model, label) => h('button.btn.btn-primary.m3', {
    onclick: () => model.removeCurrentData(),
}, label);

/**
 * Uses deprecated `obsoleteRequestButton`.
 * Please use the `failureWithMessage` with the specific dataModel (e.g. `periodsModel`) and errorObject instead.
 * @deprecated
 * @param {DataAccessModel} model dataAccessModel
 * @param {number} status request status
 * @returns {messagePanel} messagePanel informing the user about an unknown error.
 */
export const failureWithStatus = (model, status) => messagePanel(
    'no-network-90',
    'Failed to load data',
    `The services are unavailable (status: ${status ? status : 'unknown'})`,
    obsoleteRequestButton(model),
);

export const failureWithMessage = (dataModel, errorObject) => {
    const { detail, title } = errorObject.find((e) => Boolean(e));
    return messagePanel(
        'no-network-90',
        detail,
        title,
        requestButton(dataModel),
    );
};

/**
 * Uses deprecated `obsoleteRequestButton`.
 * Please use the `unknown` with the specific dataModel (e.g. `periodsModel`) instead.
 * @deprecated
 * @param {DataAccessModel} model dataAccessModel
 * @returns {messagePanel} messagePanel informing the user about an unknown error.
 */
export const obsoleteUnknown = (model) => messagePanel(
    'unexpected-90',
    'Unknown error',
    'Request could not be handled properly',
    obsoleteRequestButton(model),
);

export const unknown = (dataModel) => messagePanel(
    'unexpected-90',
    'Unknown error',
    'Request could not be handled properly',
    requestButton(dataModel),
);

export const sessionError = (model) => messagePanel(
    'session-timeout-90',
    'Session error',
    'Please retry to login',
    h('button.btn.btn-primary.m3', { onclick: () => model.login() }, 'Login'),
);

export const serviceUnavailable = (model) => messagePanel(
    'no-network-90',
    'Service temporarily unavailable',
    'Please contact the administrator',
    h('button.btn.btn-primary.m3', { onclick: async () => await model.login() }, 'Retry'),
    h('.notification-content.shadow-level3.bg-danger.white.br2.p2.notification-close', {
        id: model.dataAccess.serviceUnavailable.messageFieldId,
    }, ''),
);

export const noMatchingData = (model, page) => messagePanel(
    'nothing-found-90',
    nothingFound,
    'There is no data that matches your request',
    [
        h('button.btn.btn-secondary.m3', {
            onclick: () => {
                model.navigation.goToDefaultPageUrl(page);
            },
        }, 'Clear filters'),
        removeCurrentDataButton(model, goBack),
    ],
);

/**
 * Uses deprecated `obsoleteRequestButton`.
 * @deprecated
 * @param {DataAccessModel} model dataAccessModel
 * @returns {messagePanel} messagePanel informing the user about an unknown error.
 */
export const noDataFound = (model) => messagePanel(
    'nothing-found-90',
    nothingFound,
    'There is no data to be displayed here',
    [
        removeCurrentDataButton(model, goBack),
        obsoleteRequestButton(model),
    ],
);

export const nothingSelected = (model) => messagePanel(
    'nothing-found-90',
    'No subpage selected',
    'Please select any of the subpages',
    removeCurrentDataButton(model, goBack),
);

export const waiting = () => {
    const retryButton = h('button.btn.btn-primary.m3', { onclick: () => document.location.reload(true) }, 'Retry');
    const loadingMessage = h('h3', 'Loading...');

    return h('.panel.abs-center',
        spinner(),
        loadingMessage,
        retryButton);
};
