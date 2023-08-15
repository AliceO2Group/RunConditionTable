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

import { Observable, RemoteData } from '/js/src/index.js';
import { PaginationModel } from '../../components/table/pagination/PaginationModel.js';
import { getRemoteDataSlice } from '../../utils/fetch/getRemoteDataSlice.js';

/**
 * Model representing handlers for periods page
 *
 * @implements {OverviewModel}
 */
export default class PeriodsModel extends Observable {
    /**
     * The constructor of the Overview model object
     * @param {Model} model Pass the model to access the defined functions
     * @returns {Object} Constructs the Overview model
     */
    constructor(model) {
        super();
        this.model = model;

        this._pagination = new PaginationModel(model.userPreferences);
        this._pagination.observe(() => this.fetchAllPeriods());

        this._visibleFields = null;

        /*
         * Content
         * this._currentPagePeriods = RemoteData.notAsked();
         * this._allPeriods = RemoteData.notAsked();
         */

        this._periods = RemoteData.NotAsked();
    }

    /**
     * Reset this model to its default
     *
     * @returns {void}
     */
    reset() {
        this._periods = RemoteData.NotAsked();
        this._visibleFields = null;
        this._pagination.reset();
    }

    /**
     * Fetch all the relevant periods from the API
     *
     * @return {Promise<void>} void
     */
    async fetchAllPeriods() {
        /**
         * @type {Period[]}
         */

        /*
         * When fetching data, to avoid concurrency issues, save a flag stating if the fetched data should be concatenated with the current one
         * (infinite scroll) or if they should replace them
         */

        const shouldKeepExisting = this._pagination.currentPage > 1 && this._pagination.isInfiniteScrollEnabled;

        if (!this._pagination.isInfiniteScrollEnabled) {
            this._currentPagePeriods = RemoteData.loading();
            this.notify();
        }

        const params = {
            'page[offset]': this._pagination.firstItemOffset,
            'page[limit]': this._pagination.itemsPerPage,
        };

        this._allPeriods = RemoteData.notAsked();

        const endpoint = `/api/periods?${new URLSearchParams(params).toString()}`;
        try {
            const { items, totalCount } = await getRemoteDataSlice(endpoint);
            const concatenateWith = shouldKeepExisting ? this._periods.payload || [] : [];
            this._periods = RemoteData.success([...concatenateWith, ...items]);
            this._pagination.itemsCount = totalCount;
        } catch (errors) {
            this._periods = RemoteData.failure(errors);
        }

        this.notify();
    }

    /**
     * Getter for all the run data
     * @returns {RemoteData} Returns all of the filtered periods
     */
    getPeriods() {
        return this._allPeriods;
    }

    /**
     * Retro-compatibility access to paginated runs, returning all the runs contained in the current page if it applies
     *
     * @return {RemoteData} the runs in the current page
     */
    get periods() {
        return this._periods;
    }
}
