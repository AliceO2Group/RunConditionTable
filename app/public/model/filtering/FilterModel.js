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

    addFilter(field, value, type) {
        Object.assign(this._activeFilters,
            this._activeFilters[field]
                ? { [field]: {
                    ...this._activeFilters[field],
                    [type]: []} }
                : { [field]: {
                    [type]: []} });
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
            case 'exclude': return `[notLike]='%${value}%'`;
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
        const result = Object.keys(this._activeFilters).reduce((fieldAcc, currentField) => {
            Object.keys(this._activeFilters[currentField]).reduce((typeAcc, currentType) => {
                typeAcc.push(this._activeFilters[currentField][currentType]);
            })


            /*
            acc.push({
                field: currentField,
                type: 'sd',
                search: ,
            })
            */
        }, []);
        console.log(result);
        return result;
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
