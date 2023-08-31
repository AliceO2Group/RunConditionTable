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
import { pageTitle } from '../../components/common/pageTitle.js';

/**
 * Model representing handlers for runs per period page
 *
 * @implements {OverviewModel}
 */
export default class RunsPerPeriodModel extends Observable {
    /**
     * The constructor of the Overview model object
     * @param {Model} model Pass the model to access the defined functions
     * @returns {Object} Constructs the Overview model
     */
    constructor(model) {
        super();
        this.model = model;
        this.name = pageTitle(RCT.pageNames.runsPerPeriod, RCT.pageNames);

        this._pagination = new PaginationModel(model.userPreferences);
        this._pagination.observe(() => {
            this.fetchCurrentPageRuns();
            this.notify();
        });

        this._fields = Object.keys(RCT.fieldNames.runs).map((field) => ({ name: field, visible: true }));

        this._hideSelectedRunss = false;
        this._sortingRowVisible = false;

        this._currentPageRuns = RemoteData.notAsked();
        this._allRuns = RemoteData.notAsked();

        this._runs = RemoteData.NotAsked();
    }

    /**
     * Fetch all the relevant runs from the API
     * @param {string} periodId period id
     * @return {Promise<void>} void
     */
    async fetchAllRuns(periodId) {
        /**
         * @type {Run[]}
         */
        this._allRuns = RemoteData.loading();
        this.notify();

        this._allRuns = RemoteData.notAsked();

        const endpoint = `/api/periods/${periodId}/runs`;
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
     * @param {string} periodId period id
     * @return {Promise<void>} void
     */
    async fetchCurrentPageRuns(periodId) {
        /**
         * @type {Run[]}
         */

        if (this._allRuns.kind === 'NotAsked') {
            await this.fetchAllRuns(periodId);
        }

        this._currentPageRuns = RemoteData.loading();
        this.notify();

        const params = {
            'page[offset]': this._pagination.firstItemOffset,
            'page[limit]': this._pagination.itemsPerPage,
        };

        this._allRuns = RemoteData.notAsked();

        const endpoint = `/api/periods/${periodId}/runs/?${new URLSearchParams(params).toString()}`;
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
     * @param {string} periodId period id
     * @return {Promise<void>} void
     */
    async fetchCurrentPageData(periodId) {
        await this.fetchCurrentPageRuns(periodId);
    }

    /**
     * Get current page runs
     * @return {RemoteData} runs in the current page
     */
    get currentPageRuns() {
        return this._currentPageRuns;
    }

    /**
     * Get current page data
     * @return {RemoteData} runs in the current page
     */
    get currentPageData() {
        return this._currentPageRuns;
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

    get hideSelectedRuns() {
        return this._hideSelectedRuns;
    }

    get sortingRowVisible() {
        return this._sortingRowVisible;
    }

    toggleSelection(run) {
        run.selected = !run.selected;
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
