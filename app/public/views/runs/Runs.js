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
import { RCT } from '../../config.js';
const { pageNames: PN } = RCT;

/**
 * Model representing handlers for the runs page
 *
 * @implements {OverviewModel}
 */
export default class Runs extends Observable {
    /**
     * The constructor of the Overview model object
     *
     * @param {Model} model Pass the model to access the defined functions
     */
    constructor(model) {
        super();
        this.model = model;
        this._flags = RemoteData.NotAsked();
    }

    getRunsPerDataPass(dataPass) {
        return this.model.submodels[this.model.mode].fetchedData[PN.runsPerDataPass][dataPass].payload.rows;
    }

    getRun(dataPass, runNumber) {
        const runsPerDataPass = this.getRunsPerDataPass(dataPass);
        return runsPerDataPass.find((run) => run.run_number.toString() === runNumber.toString());
    }
}
