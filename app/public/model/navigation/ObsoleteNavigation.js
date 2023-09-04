/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { Observable } from '/js/src/index.js';
import { RCT } from '../../config.js';
import { noRunNumbers } from '../../utils/defaults.js';
const { pageNames, dataReqParams, defaultDataReqParams } = RCT;

/**
 * Model representing handlers for navigation change
 *
 * @implements {OverviewModel}
 * @deprecated
 */
export default class Navigation extends Observable {
    /**
     * The constructor of the Overview model object
     *
     * @param {Model} model main model to access the general functions
     * @param {DataAccessModel} parent model to access the data fetching functions
     */
    constructor(model, parent) {
        super();
        this.parent = parent;
        this.model = model;
        this.router = model.router;
        this.routerCallback = this.handleLocationChange.bind(this);
        this.router.observe(this.routerCallback);
        this.router.bubbleTo(this);

        this.pageNumber = defaultDataReqParams.pageNumber;

        this.handleLocationChange();
    }

    async handleLocationChange() {
        const url = this.router.getUrl();
        const { page } = this.router.params;
        switch (url.pathname) {
            case '/': {
                if (! page) {
                    this.router.go(`/?page=${pageNames.periods}${this.pageNumberReqParamsPhrase()}&sorting=-name`);
                } else {
                    await this.pageNavigation(url, page);
                    this.parent.fetchedData.reqForData()
                        .then(() => {})
                        .catch(() => {});
                }
                break;
            }
            default:
                break;
        }
    }

    async pageNavigation(url, page) {
        switch (page) {
            case pageNames.flags: {
                const dataPassName = this.router.params['data_pass_name'];
                if (dataPassName) {
                    await this.model.runs.fetchRunsPerDataPass(dataPassName).then(() => {}).catch(() => {});

                    const dpSearchParams = `?page=${pageNames.runsPerDataPass}&index=${dataPassName}`;
                    const dpUrl = new URL(url.origin + url.pathname + dpSearchParams + this.pageNumberReqParamsPhrase());
                    this.parent.fetchedData.reqForData(true, dpUrl).then(() => {
                        const runNumbers = this.model.runs.getRunsPerDataPass(dataPassName).map((row) => row.run_number);
                        this.model.runs.fetchFlagsSummary(dataPassName, runNumbers).then(() => {
                            this.parent.fetchedData.reqForData();
                        }).catch(() => {});
                    });
                }
                break;
            }
            default: {
                this.parent.fetchedData.reqForData()
                    .then(() => {})
                    .catch(() => {});
                break;
            }
        }
    }

    goToDefaultPageUrl(page) {
        const url = page === pageNames.flags
            ? `/?page=${page}&run_numbers=${noRunNumbers}${this.pageNumberReqParamsPhrase()}`
            : `/?page=${page}${this.pageNumberReqParamsPhrase()}`;
        this.router.go(url);
    }

    pageNumberReqParamsPhrase() {
        return `&${dataReqParams.itemsPerPage}=${this.model.userPreferences.itemsPerPage}&${dataReqParams.pageNumber}=${this.pageNumber}`;
    }

    pageNumberReqParams() {
        return {
            [dataReqParams.itemsPerPage]: this.model.userPreferences.itemsPerPage,
            [dataReqParams.pageNumber]: this.pageNumber,
        };
    }

    handleLinkEvent(e) {
        this.router.handleLinkEvent(e);
        this.notify();
    }

    /**
     * Go to the url specified by the pageName and index
     * @param {string} targetPage - pageName that the user will be navigated to
     * @param {string} targetIndex - index on the page
     * @returns {void}
     */
    go(targetPage, targetIndex) {
        this.router.go(`/?page=${targetPage}&index=${targetIndex}${this.pageNumberReqParamsPhrase()}`);
    }
}
