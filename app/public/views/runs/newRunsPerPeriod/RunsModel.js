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

import { PaginationModel } from '../../../components/table/pagination/PaginationModel';
import { RCT } from '../../../config';
import { getRemoteDataSlice } from '../../../utils/fetch/getRemoteDataSlice';
import { Observable, RemoteData } from '/js/src/index.js';

/**
 * Model representing handlers for periods page
 *
 * @implements {Observable}
 */
export default class RunsModel extends Observable {
    /**
     * The constructor of the Overview model object
     * @param {Model} model Pass the model to access the defined functions
     * @param {RemoteData} period period that the runs are anchored to
     * @returns {Object} Constructs the Overview model
     */
    constructor(model, period) {
        super();
        this.model = model;
        this.period = period;

        this._pagination = new PaginationModel(model.userPreferences);
        this._pagination.observe(() => {
            this.fetchCurrentPageRuns();
            this.notify();
        });

        this.fields = Object.keys(RCT.fieldNames.runs).map((field) => ({ name: field, visible: true }));

        this._sortingRowVisible = false;

        this._allRuns = RemoteData.notAsked();
        this._currentPageRuns = RemoteData.notAsked();
    }

    /**
     * Fetch all the relevant runs from the API
     * @return {Promise<void>} void
     */
    async fetchAllRuns() {
        /**
         * @type {Run[]}
         */
        this._allRuns = RemoteData.loading();
        this.notify();

        this._allRuns = RemoteData.notAsked();

        const endpoint = `/api/periods/${this.period.id}/runs`;
        try {
            const { items, totalCount } = await getRemoteDataSlice(endpoint);
            this._allRuns = RemoteData.success([...items]);
            this._pagination.itemsCount = totalCount;
        } catch (errors) {
            this._allRuns = RemoteData.failure(errors);
        }

        this.notify();
    }

    /**
     * Fetch all the relevant runs from the API
     * @return {Promise<void>} void
     */
    async fetchCurrentPageRuns() {
        /**
         * @type {Run[]}
         */

        if (this._allRuns.kind === 'NotAsked') {
            await this.fetchAllRuns();
        }

        this._currentPageRuns = RemoteData.loading();
        this.notify();

        const params = {
            'page[offset]': this._pagination.firstItemOffset,
            'page[limit]': this._pagination.itemsPerPage,
        };

        this._allRuns = RemoteData.notAsked();

        const endpoint = `/api/periods/${this.period.id}/runs/?${new URLSearchParams(params).toString()}`;
        try {
            const { items, totalCount } = await getRemoteDataSlice(endpoint);
            this._currentPagePeriods = RemoteData.success([...items]);
            this._pagination.currentPageItemsCount = totalCount;
        } catch (errors) {
            this._currentPagePeriods = RemoteData.failure(errors);
        }

        this.notify();
    }

    /**
     * Fetch all the relevant data from the API
     *
     * @return {Promise<void>} void
     */
    async fetchCurrentPageData() {
        await this.fetchCurrentPageRuns();
    }

    get fields() {
        return this._fields;
    }
}
