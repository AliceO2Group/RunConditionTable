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
    constructor(model) {
        super();
        this.model = model;
        this.messageFieldId = 'serviceUnavailableMessageFieldID';
    }

    showResult(result) {
        const field = document.getElementById(this.messageFieldId);
        if (field) {
            field.innerText = result.message ? result.message : result;
            field.classList.remove('notification-close');
            field.classList.add('notification-open');
        }
    }

    hideResult() {
        const field = document.getElementById(this.messageFieldId);
        if (field) {
            field.innerText = '';
            field.classList.add('notification-close');
            field.classList.remove('notification-open');
        }
    }
}
