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

/**
 * Model representing handlers for the flags page
 *
 * @implements {OverviewModel}
 */
export default class Flags extends Observable {
    /**
     * The constructor of the Overview model object
     *
     * @param {Model} model Pass the model to access the defined functions
     */
    constructor(model) {
        super();
        this.model = model;
    }

    getAllFlags() {
        const [flagsDataIndex] = Object.keys(this.model.dataAccess.fetchedData[PN.flags]);
        return this.model.dataAccess.fetchedData[PN.flags][flagsDataIndex].payload.rows;
    }

    getFlags(runNumber, detector) {
        const allFlags = this.getAllFlags();
        const flags = !Array.isArray(allFlags) ? [] : allFlags.map((flag) => {
            const { verifications } = flag;
            flag.verification_time = verifications?.map(({ verification_time }) => verification_time);
            flag.by = verifications?.map(({ by }) => by);
            return flag;
        });
        return flags.filter((e) => e.detector === detector && e.run_number.toString() === runNumber.toString());
    }
}
