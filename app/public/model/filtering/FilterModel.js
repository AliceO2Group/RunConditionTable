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
            }
            default: break;
        }
    }

    resetFilterValue(field, type) {
        this._activeFilters[field][type] = [];
    }

    prepareObjectStructure(field, type) {
        if (!this._activeFilters.hasOwnProperty(field)) {
            this._activeFilters[field] = {
                [type]: [],
            }
        }
        if (!this._activeFilters[field].hasOwnProperty(type)) {
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
        console.log(this.filterObjects);
    }

    removeFilter(field, value, type) {
        if (this._activeFilters[field][type]) {
            delete this._activeFilters[field][type];
        }
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
        console.log(this._activeFilters);

        const fields = Object.keys(this._activeFilters);
        
        console.log(fields);

        const result = fields.map((field) => {
            const types = Object.keys(this._activeFilters[field]);
            return types.reduce((typeAcc, currentType) => {
                const values = this._activeFilters[field][currentType];
                values.forEach((value) => typeAcc.push({
                    field: field,
                    type: currentType,
                    value: value,
                }));
                return typeAcc;
            }, []);
        });
        return result.flat();
    }

    isAnyFilterActive() {
        return Object.keys(this._activeFilters).length > 0;
    }

    buildFilterPhrase() {
        let filterPhrase = '';
        for (const [field, typeValues] of Object.entries(this._activeFilters)) {
            for (const [type, values] of Object.entries(typeValues)) {
                values.forEach((value) => filterPhrase += `${filterPhrase.length ? '&' : ''}filter[${field}]${this.filterTypesMapping(type, value)}`);
            }
        }
        console.log(filterPhrase);
        return filterPhrase;
    }
}
