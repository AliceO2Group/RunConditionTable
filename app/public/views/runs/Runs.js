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
const { pageNames: PN } = RCT;
const { dataReqParams: DRP } = RCT;

/**
 * Model representing handlers for the runs page
 *
 * @implements {OverviewModel}
 */
export default class OldRuns extends Observable {
    /**
     * The constructor of the Overview model object
     *
     * @param {Model} model Pass the model to access the defined functions
     */
    constructor(model) {
        super();
        this.model = model;
    }

    async fetchFlagsSummary(dataPass, runNumbers) {
        const url = this.model.router.getUrl();
        const search = `?page=${PN.flags}&data_pass_name=${dataPass}&run_numbers=${runNumbers}&${DRP.itemsPerPage}=50&${DRP.pageNumber}=1`;
        const flagsUrl = new URL(url.origin + url.pathname + search);
        await this.model.dataAccess.fetchedData.reqForData(true, flagsUrl);
    }

    async fetchRunsPerDataPass(dataPass) {
        const page = this.model.dataAccess.fetchedData[PN.dataPasses];
        const [pIndex] = Object.keys(page);
        const { url } = page[pIndex].payload;
        const dpSearchParams = `?page=${PN.runsPerDataPass}&index=${dataPass}&${DRP.itemsPerPage}=50&${DRP.pageNumber}=1`;
        await this.model.dataAccess.fetchedData.reqForData(true, new URL(url.origin + url.pathname + dpSearchParams));

        const runNumbers = this.model.dataAccess.fetchedData[PN.runsPerDataPass][dataPass].payload.rows.map((row) => row.run_number);
        await this.fetchFlagsSummary(dataPass, runNumbers);
    }

    getRunsPerDataPass(dataPass) {
        return this.model.dataAccess.fetchedData[PN.runsPerDataPass][dataPass].payload.rows;
    }

    getRun(dataPass, runNumber) {
        const runsPerDataPass = this.getRunsPerDataPass(dataPass);
        return runsPerDataPass?.find((run) => run.run_number.toString() === runNumber.toString());
    }
}
