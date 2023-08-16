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
import { RCT } from '../../config.js';

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
        this._pagination.itemsPerPageSelector$.observe(() => this.notify());

        this._fields = Object.keys(RCT.fieldNames.periods).map((field) => ({ name: field, visible: true }));

        this._hideSelectedPeriods = false;
        this._sortingRowVisible = false;

        this._currentPagePeriods = RemoteData.notAsked();
        this._allPeriods = RemoteData.notAsked();

        this._periods = RemoteData.NotAsked();
    }

    /**
     * Reset this model to its default
     *
     * @returns {void}
     */
    reset() {
        this._periods = RemoteData.NotAsked();
        this._fields = Object.keys(RCT.fieldNames.periods).map((field) => ({ fieldName: field, marked: true }));
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
            this._currentPagePeriods = RemoteData.success([...concatenateWith, ...items]);
            this._pagination.itemsCount = totalCount;
        } catch (errors) {
            this._currentPagePeriods = RemoteData.failure(errors);
        }

        this.notify();
    }

    /**
     * Get all the periods
     * @return {RemoteData} periods
     */
    get periods() {
        return this._periods;
    }

    /**
     * Get current page periods
     * @return {RemoteData} periods in the current page
     */
    get currentPagePeriods() {
        return this._currentPagePeriods;
    }

    get visibleFields() {
        return this._fields.filter((field) => field.visible);
    }

    get fields() {
        return this._fields;
    }

    get pagination() {
        return this._pagination;
    }

    get hideSelectedPeriods() {
        return this._hideSelectedPeriods;
    }

    get sortingRowVisible() {
        return this._sortingRowVisible;
    }

    toggleSelection(period) {
        period.selected = !period.selected;
        this.notify();
    }

    toggleSortingRowVisibility() {
        this._sortingRowVisible = !this._sortingRowVisible;
        this.notify();
    }

    toggleFieldVisibility(targetField) {
        const targetFieldIndex = this._fields.findIndex((f) => f.name === targetField.name);
        const targetState = arguments[1] !== undefined
            ? arguments[1]
            : !this._fields[targetFieldIndex].visible;
        this._fields[targetFieldIndex].visible = targetState;
        this.notify();
    }
}
