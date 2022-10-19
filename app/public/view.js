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

import userPanel from './views/userView.js';
import loggingPanel from './views/loggingView.js';
import serviceUnavailablePanel from './views/serviceUnavailableView.js';
import sessionErrorPanel from './views/sessionErrorView.js';
import waitingPanel from './views/waitingView.js';
import { switchCase } from '/js/src/index.js';

export default function view(model) {
    return switchCase(model.mode, {
        serviceUnavailable: () => serviceUnavailablePanel(model.submodels[model.mode]),
        sessionError: () => sessionErrorPanel(model),
        primary: () => userPanel(model.submodels[model.mode]),
        admin: () => loggingPanel(model),
    }, () => waitingPanel())/*Switch returns function*/();
}
