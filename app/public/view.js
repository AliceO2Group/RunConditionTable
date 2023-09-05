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

import dataAccessPanel from './views/dataAccessPanel.js';
import { switchCase } from '/js/src/index.js';
import { serviceUnavailable, sessionError, waiting } from './components/messagePanel/messages.js';

/**
 * Main view layout
 * @param {Model} model - representing current application state
 * @return {vnode} application view to be drawn according to model
 */
export default function view(model) {
    const { state } = model.dataAccess;

    return switchCase(state, {
        serviceUnavailable: () => serviceUnavailable(model),
        sessionError: () => sessionError(model),
        dataAccess: () => dataAccessPanel(model),
    }, () => waiting())();
}
