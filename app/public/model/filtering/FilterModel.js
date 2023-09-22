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

    reset() {
        this._activeFilters = {};
        this.notify();
    }

    resetFilterValue(field, type) {
        this._activeFilters[field][type] = [];
    }

    resetObjectStructure(field, type) {
        if (! Object.prototype.hasOwnProperty.call(this._activeFilters, field)) {
            this._activeFilters[field] = {
                [type]: [],
            };
        }
        if (! Object.prototype.hasOwnProperty.call(this._activeFilters[field], type)) {
            this.resetFilterValue(field, type);
        }
    }

    addFilter(field, value, type) {
        this.resetObjectStructure(field, type);
        if (['from', 'to'].includes(type)) {
            this.resetFilterValue(field, type);
        }
        this._activeFilters[field][type].push(value);
        this.notify();
    }

    removeFilter(field, value, type) {
        this._activeFilters[field][type] = this._activeFilters[field][type].filter((element) => element !== value);
        this.notify();
    }

    buildOperatorPhrase(filterType, value) {
        switch (filterType) {
            case 'match': return `[or][like]=%${value}%`;
            case 'exclude': return `[and][notLike]=%${value}%`;
            case 'from': return `[gte]=${value}`;
            case 'to': return `[lte]=${value}`;
            default: return `=${value}`;
        }
    }

    buildSingleFilterPhrase(field, type, value) {
        return `filter[${field}]${this.buildOperatorPhrase(type, value)}`;
    }

    get filterObjects() {
        return Object.entries(this._activeFilters)
            .map(([field, typeToValues]) =>
                Object.entries(typeToValues)
                    .map(([type, values]) => values.map((value) => ({ field, type, value })))).flat(2);
    }

    get isAnyFilterActive() {
        return Object.keys(this._activeFilters).length > 0;
    }

    get filterPhrase() {
        return this.filterObjects.map(({ field, type, value }) => this.buildSingleFilterPhrase(field, type, value)).join('&');
    }
}
