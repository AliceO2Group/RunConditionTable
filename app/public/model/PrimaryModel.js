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
import { defaultIndex, defaultIndexString, defaultRunNumbers } from '../utils/defaults.js';
const { dataReqParams } = RCT;
const { pageNames } = RCT;

export default class PrimaryModel extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;
        this.router = parent.router;
        this.routerCallback = this.handleLocationChange.bind(this);
        this.router.observe(this.routerCallback);
        this.router.bubbleTo(this);

        this.fetchedData = new FetchedDataManager(this.router, this);

        this.searchFieldsVisible = false;
        this.sortingRowVisible = false;

        this.loader = new Loader();

        this.handleLocationChange(); // Init first page
    }

    changeSearchFieldsVisibility() {
        this.searchFieldsVisible = !this.searchFieldsVisible;
        this.notify();
    }

    changeSortingRowVisibility() {
        this.sortingRowVisible = !this.sortingRowVisible;
        this.notify();
    }

    async handleLocationChange() {
        const url = this.router.getUrl();
        switch (url.pathname) {
            case '/': {
                const { page } = this.router.params;
                if (! page) {
                    this.router.go(`/?page=${pageNames.periods}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-name`);
                } else {
                    this.fetchedData.reqForData()
                        .then(() => {})
                        .catch(() => {});
                }
                break;
            }
            case '/admin/':
                throw 'TODO';
            default:
                break;
        }

        /*
         *
         *Switch (url.pathname) {
         *    case '/':
         *        const page = this.router.params['page'];
         *        if (! page) {
         *            this.router.go(`/?page=${pageNames.periods}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-name`);
         *        } else {
         *            switch (page) {
         *                case pageNames.flags:
         *                    const dataPassName = this.router.params['data_pass_name'];
         *                    console.log(dataPassName);
         *                    if (dataPassName) {
         *                        /*
         *                        console.log(dataPassName);
         *                        await this.parent.runs.fetchRunsPerDataPass(dataPassName).then(() => {}).catch((e) => {console.log(e)});
         *                        console.log(this.fetchedData);
         *                        // console.log(this.fetchedData);
         *
         *                        const dpSearchParams = `?page=${pageNames.runsPerDataPass}&index=${dataPassName}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`;
         *                        const dpUrl = new URL(url.origin + url.pathname + dpSearchParams);
         *                        this.fetchedData.reqForData(true, dpUrl).then(() => {
         *                            const runNumbers = this.fetchedData[pageNames.runsPerDataPass][dataPassName].payload.rows.map((row) => row.run_number);
         *                            this.parent.runs.fetchFlagsSummary(dataPassName, runNumbers).then(() => {
         *                                this.fetchedData.reqForData();
         *                            }).catch(() => {});
         *                        });
         *
         *                    } else this.goToDefaultPageUrl(pageNames.flags);
         *                    break;
         *                default:
         *                    this.fetchedData.reqForData()
         *                        .then(() => {})
         *                        .catch(() => {});
         *                    break;
         *            }
         *        }
         *        break;
         *    case '/admin/':
         *        throw 'TODO';
         *    default:
         *        break;
         *}
         *
         */
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

    goToDefaultPageUrl(page) {
        const url = page === pageNames.flags
            ? `/?page=${page}&run_numbers=${defaultRunNumbers}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`
            : `/?page=${page}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`;
        this.router.go(url);
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
            this.goToDefaultPageUrl(page);
        }
        Reflect.deleteProperty(this.fetchedData[page], index);
        this.notify();
    }

    removeCurrentData() {
        const { page, index } = this.getCurrentDataPointer();
        this.fetchedData[page][index] = null;
        this.goToDefaultPageUrl(page);
        Reflect.deleteProperty(this.fetchedData[page], index);
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
