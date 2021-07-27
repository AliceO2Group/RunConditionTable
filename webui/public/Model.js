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

// Import frontend framework
import {Observable, fetchClient, WebSocketClient} from '/js/src/index.js';
import ModelUnlogged from "./submodels/ModelUnlogged.js";
import ModelLogged from "./submodels/logged/ModelLogged.js";

// The model
export default class Model extends Observable {
    constructor() {
        super();
        this.mode = 'unLogged';
        this.mUnlogged = new ModelUnlogged(this);
        this.mUnlogged.bubbleTo(this);

        this.mLogged = new ModelLogged(this);
        this.mLogged.bubbleTo(this);
    }

    _tokenExpirationHandler(status) {
        console.log('status', status);
        if (status === '403' || status === 403) {
            console.log('_tokenExpirationHandler');
            sessionStorage.clear();
            alert('Auth token expired!');
            document.location.reload(true);
        }
    }

    async controlServerRequest(name = '/api/auth-control') {
        const response = await fetchClient(name, {
            method: 'POST',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
        })
        console.log('controlServerRequest - response', response);
        const content = await response.json();
        console.log('controlServerRequest - content', content);

        const status = response.status;
        this._tokenExpirationHandler(status);
    }
}


