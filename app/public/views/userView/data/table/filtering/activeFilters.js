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

import { h } from '/js/src/index.js';
import { RCT } from '../../../../../config.js';
import { sqlWildCard } from '../../../../../utils/filtering/filterUtils.js';

const { dataReqParams, defaultDataReqParams, filterTypes } = RCT;

export default function activeFilters(model, url) {
    const data = model.getCurrentData();
    const dataPointer = model.getCurrentDataPointer();
    const { fields } = data;
    const baseUrl = `/?page=${dataPointer.page}&index=${dataPointer.index}`;
    const defaultUrlParams = `${dataReqParams.rowsOnSite}=${defaultDataReqParams.rowsOnSite}&${dataReqParams.site}=${defaultDataReqParams.site}`;

    const isFilterExpression = (item) => Object.values(filterTypes).reduce((acc, curr) => acc || item.includes(curr), false);

    const filterField = (filterString) => filterString.split('-')[0];
    const filterType = (filterString) => filterString.split('=')[0].split('-')[1];
    const filterSearch = (filterString) => {
        const rawSearch = decodeURIComponent(filterString.split('=')[1]);
        const type = filterType(filterString);
        if ((type === filterTypes.exclude || type === filterTypes.match) &&
            rawSearch.charAt() === sqlWildCard &&
            rawSearch.charAt(rawSearch.length - 1) === sqlWildCard) {
            return rawSearch.slice(1, -1);
        }
        return rawSearch;
    };

    const filters = url.href.split('&').filter((item) => isFilterExpression(item)).map((item) => ({
        field: filterField(item),
        type: filterType(item),
        search: filterSearch(item),
    }));

    function onClearAll() {
        const firstField = fields.find((f) => f !== undefined && f.name);
        const clearUrl = `${baseUrl}&${defaultUrlParams}&sorting=-${firstField.name}`;
        model.router.go(clearUrl);
    }

    function onClearFilter(filter) {
        const filterExpressions = url.href.split('&').filter((item) => isFilterExpression(item));
        const newUrl = url.href.replace(`&${filterExpressions.filter((item) =>
            filterField(item) === filter.field &&
            filterType(item) === filter.type &&
            filterSearch(item) === filter.search)}`, '');
        model.router.go(newUrl);
    }

    return [
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-center',
                h('h5', 'Active filters'),
                h('button.btn.btn-secondary.font-size-small', {
                    onclick: () => onClearAll(),
                }, 'Clear all'))),
        h('.flex-wrap.items-center.chips',
            filters.map((filter) => [
                h('div.chip.filter-chip.inline',
                    h('.filter-field.inline', filter.field),
                    h('.filter-type.inline', filter.type),
                    h('.filter-input.inline', filter.search),
                    h('button.btn.icon-only-button.transparent', {
                        onclick: () => {
                            onClearFilter(filter);
                        },
                    }, h('.close-10'))),
            ])),
    ];
}
