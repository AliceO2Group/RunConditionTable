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

import { Observable, Loader } from '/js/src/index.js';
import FetchedDataManager from './data/FetchedDataManager.js';
import { defaultIndex, defaultIndexString } from '../utils/defaults.js';
import Navigation from './navigation/ObsoleteNavigation.js';
import ServiceUnavailable from './ServiceUnavailable.js';
const RCT = window.RCT_CONF;
const { messageTimeout } = RCT;
const { states } = RCT.dataAccess;

/**
 * General class for managing the data access
 * @deprecated
 * Please use separate models for each view (e.g. periodsModel).
 * @param {Model} parent main model
 */
export default class DataAccessModel extends Observable {
    constructor(parent) {
        super();
        this.state = states.default;
        this.parent = parent;
        this.router = this.parent.router;

        this.serviceUnavailable = new ServiceUnavailable(parent);
        this.fetchedData = new FetchedDataManager(this.router, this);

        this.showFilteringPanel = false;
        this.sortingRowVisible = false;
        this.hideCurrentPageMarkedRows = false;

        this.loader = new Loader();

        this.navigation = new Navigation(parent, this);
    }

    setState(state, result = null) {
        this.state = state;
        this.handleStateChange(result);
    }

    handleStateChange(result) {
        if (this.state === states.serviceUnavailable) {
            setTimeout(() => {
                this.serviceUnavailable.hideResult(result);
                this.parent.notify();
                setTimeout(() => {
                    this.serviceUnavailable.showResult(result);
                    this.parent.notify();
                }, messageTimeout);
            }, messageTimeout);
        }
    }

    changeSearchFieldsVisibility() {
        this.showFilteringPanel = !this.showFilteringPanel;
        this.notify();
    }

    changeSortingRowVisibility() {
        this.sortingRowVisible = !this.sortingRowVisible;
        this.notify();
    }

    changeMarkedRowsVisibility() {
        this.hideCurrentPageMarkedRows = !this.hideCurrentPageMarkedRows;
        this.fetchedData.changeRecordsVisibility(this.getCurrentData());
    }

    async logout() {
        const logoutEndpoint = '/api/logout/';
        const { result, status, ok } = this.loader.post(logoutEndpoint);
        await this.parent._tokenExpirationHandler(status);

        localStorage.token = null;
        this.parent.mode = 'default';

        if (!ok) {
            alert(`Some error occurred: ${JSON.stringify(result)}`);
        } else {
            alert('successfully logged out');
        }

        this.router.go('/');
        this.notify();
    }

    async sync() {
        const syncEndpoint = '/api/sync/';
        this.loader.get(syncEndpoint);
        await this.fetchedData.reqForData(true);
        document.location.reload(true);
        this.notify();
    }

    getDataPointerFromUrl(url) {
        const pointer = Object.fromEntries(new URLSearchParams(url.search));
        return {
            page: pointer.page,
            index: defaultIndex(pointer.index),
        };
    }

    getCurrentDataPointer() {
        return this.getDataPointerFromUrl(this.router.getUrl());
    }

    getCurrentData() {
        const dataPointer = this.getCurrentDataPointer();
        return this.fetchedData[dataPointer.page][dataPointer.index].payload;
    }

    getSubPages(pageName) {
        return Object.keys(this.fetchedData[pageName]);
    }

    getCurrentRemoteData() {
        const dataPointer = this.getCurrentDataPointer();
        return this.fetchedData[dataPointer.page][dataPointer.index];
    }

    getData(page, index = null) {
        return this.fetchedData[page][defaultIndex(index)].payload;
    }

    getRemoteData(page, index = null) {
        return this.fetchedData[page][defaultIndex(index)];
    }

    getSubPagesCount(page) {
        return Object.keys(this.fetchedData[page]).filter((index) => index !== defaultIndexString).length;
    }

    removeSubPage(page, index) {
        this.fetchedData[page][index] = null;
        if (this.getCurrentDataPointer().page === page && this.getCurrentDataPointer().index === index) {
            this.navigation.goToDefaultPageUrl(page);
        }
        delete this.fetchedData[page][index];
        this.notify();
    }

    removeCurrentData() {
        const { page, index } = this.getCurrentDataPointer();
        this.fetchedData[page][index] = null;
        this.navigation.goToDefaultPageUrl(page);
        delete this.fetchedData[page][index];
    }

    handleSessionError() {
        this.parent.mode = 'sessionError';
        this.notify();
    }
}
