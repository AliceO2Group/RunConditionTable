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

    handleValueChange(field, type, value) {
        switch (type) {
            case 'match':
            case 'exclude': {
                this._activeFilters[field][type].push(value);
                break;
            }
            case 'from':
            case 'to': {
                this._activeFilters[field][type] = [];
                this._activeFilters[field][type].push(value);
                break;
            }
            default: break;
        }
    }

    resetFilterValue(field, type) {
        this._activeFilters[field][type] = [];
    }

    prepareObjectStructure(field, type) {
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
        this.prepareObjectStructure(field, type);
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

    filterTypesMapping(filterType, value) {
        switch (filterType) {
            case 'match': return `[or][like]=%${value}%`;
            case 'exclude': return `[and][notLike]='%${value}%'`;
            case 'from': return `[gte]=${value}`;
            case 'to': return `[lte]=${value}`;
            default: return `=${value}`;
        }
    }

    get activeFilters() {
        return this._activeFilters;
    }

    get filterObjects() {
        const result = Object.keys(this._activeFilters).map((field) =>
            Object.keys(this._activeFilters[field]).reduce((typeAcc, currentType) => {
                this._activeFilters[field][currentType].forEach((value) => typeAcc.push({
                    field: field,
                    type: currentType,
                    value: value,
                }));
                return typeAcc;
            }, []));
        return result.flat();
    }

    isAnyFilterActive() {
        return Object.keys(this._activeFilters).length > 0;
    }

    addSingleFilterPhrase(filterPhrase, field, type, value) {
        return `${filterPhrase}${filterPhrase.length ? '&' : ''}filter[${field}]${this.filterTypesMapping(type, value)}`;
    }

    buildFilterPhrase() {
        let filterPhrase = '';
        for (const [field, typeValues] of Object.entries(this._activeFilters)) {
            for (const [type, values] of Object.entries(typeValues)) {
                filterPhrase = values.reduce((acc, value) => this.addSingleFilterPhrase(acc, field, type, value), filterPhrase);
            }
        }
        return filterPhrase;
    }
}
