import {RemoteData, Loader} from '/js/src/index.js';

import RCT_DATA_PAGES from "../../../RCT_DATA_PAGES.js";
import FetchedData from "./FetchedData.js";
import {getPathElems, replaceUrlParams, url2Str} from "../../../utils/utils.js";

const rctDataServerPathname = '';
const apiPrefix = '/api/Rct-Data'

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
        
        for (let pageName of RCT_DATA_PAGES) {
            this[pageName] = {};
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
            console.log("second type reqForData")
            await this.req(false, url);
        }
    }

    async req(countAllRecord, url) {
        const pathIdents = getPathElems(url.pathname)
        let page = pathIdents[0]
        let index = defaultIndex(pathIdents[1])


        this.assertConditionsForReqForData(url, params)
        let totalRecordsNumber = null;
        if (!countAllRecord)
            totalRecordsNumber = this[page][index].payload.totalRecordsNumber

        this[page][index] = RemoteData.Loading();
        this[page][index].payload = {"url": url} // TODO maybe it should be considered in WebUI
        this.model.notify();

        let reqEndpoint = this.getReqEndpoint(url, countAllRecord);
        let {result, status, ok} = await this.model.loader.get(reqEndpoint);

        if (!ok)
            this[page][index] = RemoteData.failure({"status": status, "url": url});
        else
            this[page][index] = RemoteData.Success(new FetchedData(url, result, totalRecordsNumber));
        this.model.notify();
    }

    getReqEndpoint(url, countAllRecord) {
        return apiPrefix + url.pathname + url.search + (countAllRecord ? '&count-records=true' : '');
    }

    changeSite(site) {
        console.log("change site")
        const url = this.router.getUrl();

        const newUrl = replaceUrlParams(url, [['site', site]]);
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
        console.assert(params.hasOwnProperty('rowsOnSite'));
        console.assert(params.hasOwnProperty('site'));
    }

    consoleLogStructure(full=false) {
        if (full)
            console.log(this);
        else {
            const pObj = {};
            for (let pageName in RCT_DATA_PAGES) {
                pObj[pageName] = [];
                for (let p in this[pageName]) {
                    if (this[pageName].hasOwnProperty(p))
                        pObj[pageName].push(p);
                }
            }
            console.log(pObj);
        }
    }

    clear() {
        for (let pageName in RCT_DATA_PAGES) {
            this[pageName] = {};
        }
    }

    delete(page, index) {
        this[page][index] = undefined;
    }
}