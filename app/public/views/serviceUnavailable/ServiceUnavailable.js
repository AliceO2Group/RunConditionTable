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

import { Observable } from '/js/src/index.js';

export default class ServiceUnavailable extends Observable {
    constructor(model, result) {
        super();
        this.model = model;
        this.lastResult = result;
        this.messageFieldId = 'serviceUnavailableMessageFieldID';
    }

    async retry() {
        await this.model.login();
    }

    showResult(result) {
        const field = document.getElementById(this.messageFieldId);
        field.innerText = result.message;
        field.classList.remove('notification-close');
        field.classList.add('notification-open');
    }

    hideResult() {
        const field = document.getElementById(this.messageFieldId);
        field.innerText = '';
        field.classList.add('notification-close');
        field.classList.remove('notification-open');
    }
}
