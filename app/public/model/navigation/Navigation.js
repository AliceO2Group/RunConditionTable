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

/**
 * Model representing navigation - aimed to use for url related tasks
 */
export default class Navigation extends Observable {
    /**
     * The constructor of the Navigation object
     *
     * @param {Model} model main model
     */
    constructor(model) {
        super();
        this.model = model;
        this.router = model.router;
    }

    handleLinkEvent(e) {
        this.router.handleLinkEvent(e);
        this.notify();
    }
}
