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





import {Observable, Loader} from '/js/src/index.js';
import FetchedDataManager from "./modelData/FetchedDataManager.js";
import applicationProperties from "../../applicationProperties.js";
const dataReqParams = applicationProperties.dataReqParams;
const pagesNames = applicationProperties.pagesNames;


export default class Submodel1 extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;
        this.router = parent.router;
        this.routerCallback = this.handleLocationChange.bind(this);
        this.router.observe(this.routerCallback);
        this.router.bubbleTo(this)

        this.fetchedData = new FetchedDataManager(this.router, this);
        
        this.searchFieldsVisible = false;

        this.loader = new Loader()


        this.handleLocationChange(); // Init first page
    }

    changeSearchFieldsVisibility() {
        this.searchFieldsVisible = !this.searchFieldsVisible;
    }

    handleLocationChange() {
        const url = this.router.getUrl();
        switch (url.pathname) {
            default:
                if (url.pathname === "/") {
                    this.router.go(`/periods/?&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`)
                } else {
                    this.fetchedData.reqForData()
                        .then(r => {})
                        .catch(e => {console.error(e)});
                }
                break;
        }
    }


    async logout() {
        const logoutEndpoint = '/api/logout/'
        const {result, status, ok} = this.loader.post(logoutEndpoint)
        this.parent._tokenExpirationHandler(status);

        localStorage.token = null;
        this.parent.mode = "default";

        if (!ok) {
            alert("Some error occurred: " + JSON.stringify(result));
        } else {
            alert('successfully logged out');
        }

        this.router.go('/');
        this.notify();
    }
}