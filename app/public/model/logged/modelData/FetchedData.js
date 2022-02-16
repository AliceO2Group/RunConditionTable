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




const defaultRowsOnSite = 100;
const defaultSite = 1;

import {RCT} from "../../../config.js";
/**
 * Object of this class is used to hold data fetched from backend
 * set of data held in this structure are fully defined by the url given as on of constructor arguments
 * when some filtering parameters are or site, etc. is changed
 * the url is also changed in order to be consistent with data
 *
 */

export default class FetchedData {
    constructor(url, content, totalRecordsNumber=null) {
        this.url = url;
        console.log(content)

        this.fields = null;
        this.rows = null;

        this.totalRecordsNumber = null;
        this.hideMarkedRecords = false;

        this.rowsOnsite = null;
        this.site = null;

        this.parseFetchedFields(content)
        this.parseFetchedRows(content)
        if (!totalRecordsNumber)
            this.setInfoAboutTotalRecordsNumber(content)
        else
            this.totalRecordsNumber = totalRecordsNumber;

        this.setSiteAndRowsOnSite()

    }

    setSiteAndRowsOnSite() {
        const params = Object.fromEntries(this.url.searchParams.entries());
        const appPropParams = RCT.dataReqParams;
        this.rowsOnsite = params.hasOwnProperty(appPropParams.rowsOnsite) ? params[appPropParams.rowsOnsite] : defaultRowsOnSite;
        this.site = params.hasOwnProperty(appPropParams.site) ? params[appPropParams.site] : defaultSite;
    }


    parseFetchedFields(content) {
        this.fields = content.data.fields.map(item => {
            item.marked = true;
            return item;
        });
    }
    parseFetchedRows(content) {
        this.rows = content.data.rows.map(item => {
            item.marked = false;
            return item;
        });
    }
    setInfoAboutTotalRecordsNumber(content) {
        if (this.totalRecordsNumber === null || this.totalRecordsNumber === undefined) {
            this.totalRecordsNumber = content.data.totalRecordsNumber;
        }
    }
}
