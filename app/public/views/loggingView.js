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
import loginInputForm from '../components/common/inputForm.js';
import viewButton from '../components/common/viewButton.js';

async function handleLogin(model) {
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const dbnameEl = document.getElementById('dbname');
    const dbname = dbnameEl.value === '' ? dbnameEl.placeholder : dbnameEl.value;

    await model.login(username, password, dbname);
}

export default function loggingPanel(model) {
    const loginButton = viewButton(model, 'Login', () => handleLogin(model), '', undefined, '.loginButton');
    const title = h('h5.italic', 'Run Condition Table');
    const adminPanel = h('h3', 'Admin panel');

    return h('div.loginDiv.top-100',
        h('.flex',
            h('.inspect-90'),
            h('.inline.top-15.left-10',
                title,
                adminPanel)),
        h('div.loginForm', [
            loginInputForm('Database', 'dbname', 'rct-db'),
            loginInputForm('Username', 'username', ''),
            loginInputForm('Password', 'password', '', true),
            loginButton])
    );
}
