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
const RCT = window.RCT_CONF;
const { detectors } = RCT;

/**
 * Model representing handlers for the detectors page
 *
 * @implements {OverviewModel}
 */
export default class Detectors extends Observable {
    /**
     * The constructor of the Overview model object
     *
     * @param {Model} model Pass the model to access the defined functions
     */
    constructor(model) {
        super();
        this.model = model;
        this._detectors = RemoteData.NotAsked();
    }

    getDetectors() {
        return this._detectors;
    }

    getDetectorName(detectorCode) {
        if (!detectorCode) {
            return 'no detector code';
        }
        const [detectorName] = detectorCode.split('_');
        const known = detectors.find((detector) => detector === detectorName.toUpperCase());
        return known ? known : `${detectorName.toUpperCase()}-unknown`;
    }
}
