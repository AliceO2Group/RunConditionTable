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
import { RCT } from '../../../config.js';
import { pageTitle } from '../../../components/common/pageTitle.js';
import { getRemoteDataSlice } from '../../../utils/fetch/getRemoteDataSlice.js';

/**
 * Model representing handlers for periods page
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

        this._selectedPeriod = RemoteData.notAsked();
        this._periods = null;
    }

    /**
     * Fetch all the relevant periods from the API
     * @param {string} periodId id of the period that the runs are anchored to
     * @return {Promise<void>} void
     */
    async fetchSelectedPeriod(periodId) {
        this._selectedPeriod = RemoteData.loading();
        this.notify();

        this._selectedPeriod = RemoteData.notAsked();

        const endpoint = `api/periods/?filter[id]=${periodId}`;
        try {
            const { items } = await getRemoteDataSlice(endpoint);
            this._selectedPeriod = RemoteData.success([...items]);
        } catch (errors) {
            this._selectedPeriod = RemoteData.failure(errors);
        }

        this.notify();
    }

    /**
     * Fetch all the relevant periods from the API
     * @param {string} _periodId id of the period that the runs are anchored to
     * @return {Promise<void>} void
     */
    async fetchAllRunsPerPeriod(_periodId) {
        // This[period.id] =
    }

    /**
     * Fetch all the relevant data from the API
     *
     * @return {Promise<void>} void
     */
    async fetchCurrentPageData() {
        await this.fetchCurrentPageRuns();
    }

    get selectedPeriod() {
        return this._selectedPeriod;
    }

    get periods() {
        return this._periods;
    }
}
