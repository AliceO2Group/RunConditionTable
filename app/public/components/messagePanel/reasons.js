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

const requestButton = (model) => h('button.btn.btn-primary.m3', {
    onclick: () => model.fetchedData.reqForData(true),
}, 'Reload');

export const failure = (model, status) => messagePanel(
    'no-network-90',
    'Failed to load data',
    `The services are unavailable (status: ${status ? status : 'unknown'})`,
    requestButton(model),
);

export const unknown = (model) => messagePanel(
    'unexpected-90',
    'Unknown error',
    'Request could not be handled properly',
    requestButton(model),
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

export const waiting = () => {
    const retryButton = h('button.btn.btn-primary.m3', { onclick: () => document.location.reload(true) }, 'Retry');
    const loadingMessage = h('h3', 'Loading...');

    return h('.panel.abs-center',
        spinner(),
        loadingMessage,
        retryButton
    );
}
