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
import serviceUnavailablePanel from './views/serviceUnavailableView.js';
import sessionErrorPanel from './views/sessionErrorView.js';
import waitingPanel from './views/waitingView.js';
import { switchCase } from '/js/src/index.js';
import loginForm from './views/loginForm.js';
import modal from './components/common/modal.js';
import { h } from '/js/src/index.js';

export const adminLoginModalId = 'adminLoginModal';

export default function view(model) {
    return h('',
        modal(loginForm(model), adminLoginModalId),
        switchCase(model.mode, {
            serviceUnavailable: () => serviceUnavailablePanel(model),
            sessionError: () => sessionErrorPanel(model),
            dataAccess: () => userPanel(model),
            admin: () => {
                document.getElementById(adminLoginModalId).style.display = 'block';
                return '';
            },
        }, () => waitingPanel())());
}
