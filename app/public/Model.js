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

import { Observable, sessionService, QueryRouter, Loader } from '/js/src/index.js';
import PrimaryModel from './model/PrimaryModel.js';
import ServiceUnavailableModel from './model/ServiceUnavailableModel.js';
import { RCT } from './config.js';
const { roles } = RCT;

export default class Model extends Observable {
    constructor() {
        super();

        this.session = sessionService.get();
        this.session.personid = parseInt(this.session.personid, 10); // Cast, sessionService has only strings
        // TODO if no personid then it is a computer so we need to parse it respectively
        this.session.roles = this.getRoles();

        /*

        this.session = {
            personid: 1,
            id: 1,
            name: 'John Doe',
            access: 'admin'
        };
        */

        this.router = new QueryRouter();
        this.router.bubbleTo(this);

        /*
        this.router.use(async (request, response, next) => {
            // if (process.env.NODE_ENV === 'test') {
                request.session = {
                    personid: 1,
                    id: 1,
                    name: 'John Doe',
                    access: 'admin'
                }});
        */
        this.loader = new Loader();

        this.mode = null;
        this.submodels = {};

        this.logginEndpoint = '/api/login/';
        this.login('physicist');
    }

    async login(username) {
        this.mode = null;
        this.notify();
        const { status, result, ok } = await this.postLoginPasses(username);
        this._tokenExpirationHandler(status);
        if (ok) {
            this.setPrimary();
        } else if (/5\d\d/.test(status)) {
            this.setServiceUnavailable(result);
        }
    }

    postLoginPasses(username) {
        return this.loader.post(this.logginEndpoint, { username: username });
    }

    isDetectorRole(role) {
        return role.toUpperCase().startsWith(role.meta.SSO_DET_ROLE.toUpperCase());
    }

    getRoles() {
        if (this.session.access.includes(roles.dict.Admin)) {
            return [roles.dict.Admin];
        } else if (this.session.access.includes(roles.dict.Global)) {
            return [roles.dict.Global];
        } else if (this.session.access.some((role) => this.isDetectorRole(role))) {
            const roles = [];
            Object.values(roles.dict).filter((role) => this.isDetectorRole(role)).forEach((detectorRole) => {
                if (this.session.access.includes(detectorRole)) {
                    roles.push(detectorRole);
                }
            });
            return roles;
        }
        return [roles.dict.Guest];
    }

    setServiceUnavailable(result) {
        const messageShowTimeout = 200;
        const modeName = 'serviceUnavailable';
        if (!this.submodels[modeName]) {
            this.submodels[modeName] = new ServiceUnavailableModel(this);
            this.submodels[modeName].bubbleTo(this);
        }
        this.mode = modeName;
        this.notify();
        const model = this;
        setTimeout(() => {
            model.submodels[modeName].unsetResult(result);
            model.notify();
            setTimeout(() => {
                model.submodels[modeName].setResult(result);
                model.notify();
            }, messageShowTimeout);
        }, messageShowTimeout);
    }

    setPrimary() {
        const modeName = 'primary';
        localStorage.token = sessionService.session.token;
        this.submodels[modeName] = new PrimaryModel(this);
        this.submodels[modeName].bubbleTo(this);
        this.mode = modeName;
        this.notify();
    }

    _tokenExpirationHandler(status) {
        if (status == 403) {
            localStorage.token = null;
            alert('Auth token expired!');
            this.router.unobserve(this.primary.routerCallback);
            this.router.go('/', true);
            this.primary = null;
            this.mode = 'default';
            document.location.reload(true);
        }
    }

    async controlServerRequest(name = '/api/auth-control/') {
        const { status } = this.loader.get(name);
        this._tokenExpirationHandler(status);
    }

    restoreSession() {
        //TODO
    }
}
