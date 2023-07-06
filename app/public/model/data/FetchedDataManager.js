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

import { RemoteData, Loader } from '/js/src/index.js';

import FetchedData from './FetchedData.js';
import { replaceUrlParams } from '../../../utils/utils.js';
import { RCT } from '../../../config.js';
const { dataReqParams } = RCT;
const { pagesNames } = RCT;

/**
 * Object of this class provide organization of many FetchedData objects,
 * each is available as ModelFetchedDataStructure_Object[pageName][index]
 * where index is unique identifier of particular data set in chosen page
 */
export default class FetchedDataManager {
    constructor(router, model) {
        this.model = model;
        this.router = router;
        this.loader = new Loader();

        for (const n in pagesNames) {
            if (Object.prototype.hasOwnProperty.call(pagesNames, n)) {
                this[n] = {};
            }
        }
    }

    /**
     * Function ask server for data set defined by url field,
     * when first after creating object request is performed,
     * to url is added additional param 'count-records',
     * which inform backend to calculate the total number of rows in target view
     * this information is used to create site navigation
     */

    async reqForData(force = false, url = null) {
        if (url === null) {
            url = this.router.getUrl();
        }
        const { page, index } = this.model.getDataPointerFromUrl(url);
        if (page === 'flags') {
            return;
        }
        const data = this[page][index];
        if (!data || force) {
            await this.req(true, url);
        } else if (data.payload.url.href !== url.href) {
            if (this.diffOnlyBySiteAndSorting(url, data.payload.url)) {
                await this.req(false, url);
            } else {
                await this.req(true, url);
            }
        }
    }

    diffOnlyBySiteAndSorting(url1, url2) {
        const p1 = Object.fromEntries(new URLSearchParams(url1.search));
        const p2 = Object.fromEntries(new URLSearchParams(url2.search));
        p1['site'] = undefined;
        p1['sorting'] = undefined;
        p2['site'] = undefined;
        p2['sorting'] = undefined;

        return JSON.stringify(p1) == JSON.stringify(p2);
    }

    async req(countAllRecord, url) {
        const { page, index } = this.model.getDataPointerFromUrl(url);

        let totalRecordsNumber = null;
        if (!countAllRecord) {
            ({ totalRecordsNumber } = this[page][index].payload);
        }

        const previous = this[page][index];
        this[page][index] = RemoteData.Loading();
        this[page][index].payload = { url: url }; // TODO maybe it should be considered in WebUI
        this.model.notify();

        const reqEndpoint = this.getReqEndpoint(url, countAllRecord);
        const { result, status, ok } = await this.model.loader.get(reqEndpoint);
        this.model.parent._tokenExpirationHandler(status);

        if (ok) {
            const s = RemoteData.Success(new FetchedData(url, result, totalRecordsNumber));
            this[page][index] = s;
            previous?.match({
                NotAsked: () => {},
                Loading: () => {},
                Failure: () => {},
                Success: () => {
                    s.payload.fields = previous.payload.fields;
                },
            });
        } else {
            this[page][index] = previous;
            alert(`${status} ${result?.message}`);
            if (result?.message.includes('SESSION_ERROR')) {
                this.model.handleSessionError();
            }
            this.router.go(previous?.payload?.url ? previous.payload.url : '/');
        }
        this.model.notify();
    }

    getReqEndpoint(url, countAllRecord) {
        const apiPrefix = `/api${RCT.endpoints.rctData}`;
        return apiPrefix + url.pathname.substring(1) + url.search + (countAllRecord ? '&count-records=true' : '');
    }

    changePage(pageNumber) {
        const url = this.router.getUrl();
        const newUrl = replaceUrlParams(url, [[dataReqParams.site, pageNumber]]);
        this.router.go(newUrl);
    }

    changeSorting(sorting) {
        const url = this.router.getUrl();
        const { field, order } = sorting;
        const newUrl = replaceUrlParams(url, [['sorting', `${order == -1 ? '-' : ''}${field}`]]);
        this.router.go(newUrl);
    }

    changeRowsOnSite(rowsOnSite) {
        const url = this.router.getUrl();
        const newUrl = replaceUrlParams(url, [[dataReqParams.rowsOnSite, rowsOnSite]]);
        this.router.go(newUrl);
    }

    changeItemStatus(item) {
        item.marked = arguments[1] !== undefined
            ? arguments[1]
            : !item.marked;
        this.model.notify();
    }

    changeRecordsVisibility(data) {
        data.hideMarkedRecords = !data.hideMarkedRecords;
        this.model.notify();
    }

    clear() {
        for (const n in pagesNames) {
            if (Object.prototype.hasOwnProperty.call(pagesNames, n)) {
                this[n] = {};
            }
        }
    }

    delete(page, index) {
        this[page][index] = undefined;
    }
}
