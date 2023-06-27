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
import { RCT } from '../config.js';
import { defaultIndex } from '../utils/defaults.js';
const { dataReqParams } = RCT;

export default class PrimaryModel extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;
        this.router = parent.router;
        this.routerCallback = this.handleLocationChange.bind(this);
        this.router.observe(this.routerCallback);
        this.router.bubbleTo(this);

        this.fetchedData = new FetchedDataManager(this.router, this);

        this.searchFieldsVisible = true;

        this.loader = new Loader();

        this.handleLocationChange(); // Init first page
    }

    changeSearchFieldsVisibility() {
        this.searchFieldsVisible = !this.searchFieldsVisible;
        this.notify();
    }

    handleLocationChange() {
        const url = this.router.getUrl();
        switch (url.pathname) {
            case '/':
                if (! this.router.params['page']) {
                    this.router.go(`/?page=periods&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-name`);
                } else {
                    this.fetchedData.reqForData()
                        .then(() => {})
                        .catch(() => {});
                }
                break;
            case '/admin/':
                throw 'TODO';
            default:
                break;
        }
    }

    async logout() {
        const logoutEndpoint = '/api/logout/';
        const { result, status, ok } = this.loader.post(logoutEndpoint);
        this.parent._tokenExpirationHandler(status);

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

    removeSubPage(page, index) {
        this.fetchedData[page][index] = null;
        if (this.getCurrentDataPointer().page === page && this.getCurrentDataPointer().index === index) {
            history.back();
        }
        this.notify();

        // History.back();
    }

    removeCurrentData() {
        const { page, index } = this.getCurrentDataPointer();
        this.fetchedData[page][index] = null;
        history.back();
    }

    handleClick(e) {
        this.router.handleLinkEvent(e);
        this.notify();
    }

    handleSessionError() {
        this.parent.mode = 'sessionError';
        this.notify();
    }
}
