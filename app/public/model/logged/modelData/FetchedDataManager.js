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




import {RemoteData, Loader} from '/js/src/index.js';

import FetchedData from "./FetchedData.js";
import {getPathElems, replaceUrlParams, url2Str} from "../../../utils/utils.js";
import {defaultIndex} from "../../../utils/defaults.js";
import {RCT} from "../../../config.js"
const dataReqParams = RCT.dataReqParams;
const pagesNames = RCT.pagesNames;

/**
 * Object of this class provide that many FetchedData objects are organized,
 * each is available as ModelFetchedDataStructure_Object[pageName][index]
 * where index is unique identifier of particular data set in chosen page
 */
export default class FetchedDataManager {
    constructor(router, model) {
        this.model = model
        this.router = router;
        this.loader = new Loader();

        for (let n in pagesNames) {
            if (pagesNames.hasOwnProperty(n))
                this[n] = {};
        }
    }
    /**
     * function ask server for data set defined by url field,
     * when first after creating object request is performed,
     * to url is added additional param 'count-records',
     * which inform backend to calculate the total number of rows in target view
     * this information is used to create site navigation
     */

    async reqForData(force=false, url=null) {

        if (url === null)
            url = this.router.getUrl();
        const pathIdents = getPathElems(url.pathname)
        let page = pathIdents[0]
        let index = defaultIndex(pathIdents[1])

        const data = this[page][index]
        if (!data || force)
            await this.req(true, url);
        else if (url2Str(data.payload.url) !== url2Str(url)) {
            await this.req(false, url);
        }
    }

    async req(countAllRecord, url) {
        const pathIdents = getPathElems(url.pathname)
        let page = pathIdents[0]
        let index = defaultIndex(pathIdents[1])


        this.assertConditionsForReqForData(url, this.router.params)
        let totalRecordsNumber = null;
        if (!countAllRecord)
            totalRecordsNumber = this[page][index].payload.totalRecordsNumber

        this[page][index] = RemoteData.Loading();
        this[page][index].payload = {"url": url} // TODO maybe it should be considered in WebUI
        this.model.notify();

        let reqEndpoint = this.getReqEndpoint(url, countAllRecord);
        console.log(`FetchedDataManager::: req() :: reqEndpoint: ${reqEndpoint}`)
        let {result, status, ok} = await this.model.loader.get(reqEndpoint);
        this.model.parent._tokenExpirationHandler(status);

        if (!ok)
            this[page][index] = RemoteData.failure({"status": status, "url": url});
        else
            this[page][index] = RemoteData.Success(new FetchedData(url, result, totalRecordsNumber));
        this.model.notify();
    }

    getReqEndpoint(url, countAllRecord) {
        const apiPrefix = '/api' + RCT.endpoints.rctData;
        // TODO it will be if handling such endpoints is handled on backend side
        return apiPrefix + url.pathname.substring(1) + url.search + (countAllRecord ? '&count-records=true' : '');
        // TODO below there is temporary solution
        // const pathIdent = getPathElems(url.pathname)
        // return apiPrefix + url.search + `&page=${pathIdent[0]}` + (pathIdent[1] ? `&index=${pathIdent[1]}` : '');

    }

    changeSite(site) {
        console.log("change site")
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


    assertConditionsForReqForData(url, params) {
        console.assert(params.hasOwnProperty(dataReqParams.rowsOnSite));
        console.assert(params.hasOwnProperty(dataReqParams.site));
    }


    clear() {
        for (let n in pagesNames) {
            if (pagesNames.hasOwnProperty(n))
                this[n] = {};
        }
    }

    delete(page, index) {
        this[page][index] = undefined;
    }
}