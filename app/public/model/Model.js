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

import {Observable, sessionService, QueryRouter, Loader} from '/js/src/index.js';
import Submodel1 from "./logged/Submodel1.js";

export default class Model extends Observable {
    constructor() {
        super();
        this.router = new QueryRouter();
        this.router.bubbleTo(this);
        this.loader = new Loader();

        this.mode = 'default'; // TODO delete or give meaning to this statement;
        this.submodel1 = null;
        this.logginEndpoint = "/api/login/"

    }


    async login(username, password, dbname) {

        const {result, status, ok} = await this.postLoginPasses(username, password, dbname)
        this._tokenExpirationHandler(status);
        if (ok)
            this.handleSuccessInLogin()
    }


    postLoginPasses(username, password, dbname) {
        return this.loader.post(
            this.logginEndpoint,
            {username: username, password: password, dbname: dbname}
        )
    }
    handleSuccessInLogin() {
        localStorage.token =  sessionService.session.token;
        this.submodel1 = new Submodel1(this);
        this.submodel1.bubbleTo(this);
        this.mode = "submodel1";
        this.notify();
    }



    _tokenExpirationHandler(status) {
        console.log('status', status);
        if (status == 403) {
            localStorage.token = null;
            alert('Auth token expired!');
            this.router.unobserve(this.router.submodel1.routerCallback);
            this.router.go('/', true);
            this.submodel1 = null;
            this.mode = "default";
            document.location.reload(true);
        }
    }

    async controlServerRequest(name = '/api/auth-control/') {
        const {result, status, ok} = this.loader.get(name);
        this._tokenExpirationHandler(status);
    }

    restoreSession() {
        //TODO
    }

}


