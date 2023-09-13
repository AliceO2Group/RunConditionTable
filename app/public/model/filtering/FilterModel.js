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
        Object.assign(this._activeFilters,
            this._activeFilters[field]
                ? { [field]: {
                    ...this._activeFilters[field],
                    [type]: value } }
                : { [field]: {
                    [type]: value } });
        this.notify();
    }

    filterTypesMapping(filterType, value) {
        switch (filterType) {
            case 'match': return `[like]=%${value}%`;
            case 'exclude': return `[notLike]=%${value}%`;
            default: return `=${value}`;
        }
    }

    get activeFilters() {
        return this._activeFilters;
    }

    buildFilterPhrase() {
        let filterPhrase = '';
        for (const [field, typeValues] of Object.entries(this._activeFilters)) {
            for (const [type, value] of Object.entries(typeValues)) {
                filterPhrase += `${filterPhrase.length ? '&' : ''}filter[${field}]${this.filterTypesMapping(type, value)}`;
            }
        }
        return filterPhrase;
    }
}
