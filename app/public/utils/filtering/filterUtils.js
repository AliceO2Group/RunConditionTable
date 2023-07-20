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
import { RCT } from '../../config.js';
const { filterTypes, fieldNames } = RCT;
const sqlWildCard = '%';

export const filterField = (filterString) => filterString.split('-')[0];

export const filterType = (filterString) => filterString.split('=')[0].split('-')[1];

export const filterSearch = (filterString) => {
    const rawSearch = decodeURIComponent(filterString.split('=')[1]);
    const type = filterType(filterString);
    if ((type === filterTypes.exclude || type === filterTypes.match) &&
        rawSearch.charAt() === sqlWildCard &&
        rawSearch.charAt(rawSearch.length - 1) === sqlWildCard) {
        return rawSearch.slice(1, -1);
    }
    return rawSearch;
};

export const isFilterExpression = (item) => Object.values(filterTypes).reduce((acc, curr) => acc || item.includes(curr), false);

export const wrappedUserInput = (input, field, page) => {
    const wrap = fieldNames[page][field].filterInput === 'text' ? '%' : '';
    return `${wrap}${input}${wrap}`;
};

export const anyFiltersActive = (url) => url.href.includes(filterTypes.match) ||
        url.href.includes(filterTypes.exclude) ||
        url.href.includes(filterTypes.between);

export const filtersFromUrl = (url) => url.href.split('&').filter((item) => isFilterExpression(item)).map((item) => ({
    field: filterField(item),
    type: filterType(item),
    search: filterSearch(item),
}));
