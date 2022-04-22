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
import { replaceUrlParams, url2Str } from '../../../utils/utils.js';
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

        const data = this[page][index];
        if (!data || force) {
            await this.req(true, url);
        } else if (url2Str(data.payload.url) !== url2Str(url)) {
            await this.req(false, url);
        }
    }

    async req(countAllRecord, url) {
        const { page, index } = this.model.getDataPointerFromUrl(url);

        let totalRecordsNumber = null;
        if (!countAllRecord) {
            // eslint-disable-next-line prefer-destructuring
            totalRecordsNumber = this[page][index].payload.totalRecordsNumber;
        }

        this[page][index] = RemoteData.Loading();
        this[page][index].payload = { url: url }; // TODO maybe it should be considered in WebUI
        this.model.notify();

        const reqEndpoint = this.getReqEndpoint(url, countAllRecord);
        console.log(reqEndpoint);
        const { result, status, ok } = await this.model.loader.get(reqEndpoint);
        this.model.parent._tokenExpirationHandler(status);

        if (!ok) {
            this[page][index] = RemoteData.failure({ status: status, url: url });
        } else {
            this[page][index] = RemoteData.Success(new FetchedData(url, result, totalRecordsNumber));
        }
        this.model.notify();
    }

    getReqEndpoint(url, countAllRecord) {
        const apiPrefix = `/api${RCT.endpoints.rctData}`;
        return apiPrefix + url.pathname.substring(1) + url.search + (countAllRecord ? '&count-records=true' : '');
    }

    changeSite(site) {
        const url = this.router.getUrl();
        const newUrl = replaceUrlParams(url, [[dataReqParams.site, site]]);
        this.router.go(newUrl);
    }

    changeItemStatus(item) {
        item.marked = !item.marked;
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
