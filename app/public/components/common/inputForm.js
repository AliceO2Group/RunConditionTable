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

import { h, switchCase } from '/js/src/index.js';

export default function loginInputForm(label, id, placeholder, hide = false) {
    return h('', 
    h('label.input-label', label),
    h('form.icon-input', [
        h('input.loginFormInput', { id: id, type: hide ? 'password' : 'input', placeholder: placeholder }),
        switchCase(label, {
            'Database': () => h('i.input-database-24'),
            'Password': () => h('i.input-key-24'),
        }, () => h('i.input-user-24'))(),
    ]));
}
