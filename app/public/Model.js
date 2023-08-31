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
import DataAccessModel from './model/DataAccessModel.js';
import { RCT } from './config.js';
import Flags from './views/flags/Flags.js';
import Detectors from './views/detectors/Detectors.js';
import Runs from './views/runs/Runs.js';
import PeriodsModel from './views/periods/PeriodsModel.js';
import UserPreferences from './model/UserPreferences.js';
import RunsPerPeriodModel from './views/runs/RunsPerPeriodModel.js';
const { roles, dataAccess, pageNames } = RCT;

export default class Model extends Observable {
    constructor(window, document) {
        super();

        // Bind window and document
        this.document = document;
        this.window = window;

        // Bind session
        this.session = sessionService.get();
        this.session.personid = parseInt(this.session.personid, 10); // Cast, sessionService has only strings
        // TODO if no personid then it is a computer so we need to parse it respectively
        this.session.roles = this.getRoles();

        this.router = new QueryRouter();
        this.router.observe(this.handleLocationChange.bind(this));
        this.router.bubbleTo(this);

        this.loader = new Loader();
        this.loader.bubbleTo(this);

        this.userPreferences = new UserPreferences(this);
        this.userPreferences.bubbleTo(this);

        this.periods = new PeriodsModel(this);
        this.periods.bubbleTo(this);

        this.runsPerPeriod = new RunsPerPeriodModel(this);
        this.runsPerPeriod.bubbleTo(this);

        this.runs = new Runs(this);
        this.runs.bubbleTo(this);

        this.flags = new Flags(this);
        this.flags.bubbleTo(this);

        this.detectors = new Detectors(this);
        this.detectors.bubbleTo(this);

        this.dataAccess = new DataAccessModel(this);
        this.dataAccess.bubbleTo(this);
        this.dataAccess.setState(dataAccess.states.default);

        this.loginEndpoint = `/api${RCT.endpoints.login}`;
        this.login('physicist');

        this.handleLocationChange();
    }

    /**
     * Delegates sub-model actions depending on new location of the page
     * @returns {void}
     */
    async handleLocationChange() {
        switch (this.router.params.page) {
            case pageNames.periods:
                await this.periods.fetchCurrentPagePeriods();
                break;
            case pageNames.runsPerPeriod:
                if (this.router.params.periodId) {
                    await this.runsPerPeriod.fetchCurrentPageRuns(this.router.params.periodId);
                }
            default:
                break;
        }
    }

    async login(username) {
        this.dataAccess.setState(dataAccess.states.default);
        this.notify();

        const { status, result, ok } = await this.loader.post(this.loginEndpoint, { username: username });
        await this._tokenExpirationHandler(status);
        if (ok) {
            localStorage.token = sessionService.session.token;
            this.dataAccess.setState(dataAccess.states.dataAccess);
            this.notify();
        } else if (/5\d\d/.test(status)) {
            this.dataAccess.setState(dataAccess.states.serviceUnavailable, result);
        }
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

    async _tokenExpirationHandler(status) {
        if (status == 403) {
            localStorage.token = null;
            alert('Auth token expired!');
            this.router.go('/', true);
            this.dataAccess.setState(dataAccess.states.sessionError);
            document.location.reload(true);
        }
    }

    async controlServerRequest(name = '/api/auth-control/') {
        const { status } = this.loader.get(name);
        await this._tokenExpirationHandler(status);
    }

    restoreSession() {
        //TODO
    }
}
