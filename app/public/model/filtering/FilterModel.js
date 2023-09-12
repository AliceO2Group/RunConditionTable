/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { Observable } from '/js/src/index.js';

/**
 * Class for managing the filters on a general level
 */
export default class FilterModel extends Observable {
    constructor() {
        super();
        this._activeFilters = {};
    }

    addFilter(field, value, type) {
        this._filterObject[field][type] = value;
        this.notify();
    }

    get filterObject() {
        return this._filterObject;
    }

    buildFilterPhrase(field, value, type = null) {
        console.log(Object.keys(this._activeFilters));
        return `filter[${field}]${type ? `[${type}]` : ''}=${value}`;
    }
}
