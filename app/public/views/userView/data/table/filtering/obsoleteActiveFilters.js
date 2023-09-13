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
import { filterField, filterType, filterSearch, isFilterExpression, filtersFromUrl } from '../../../../../utils/filtering/filterUtils.js';

/**
 * Component responsible for displaying active filters
 * @deprecated
 * @param {*} model dataAccessModel
 * @param {*} url current url
 * @returns {vnode}
 */

export default function obsoleteActiveFilters(model, url) {
    const dataPointer = model.getCurrentDataPointer();

    function onClearAll() {
        model.navigation.go(dataPointer.page, dataPointer.index);
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
        h('.flex-wrap.justify-between.items-center',
            h('.flex-wrap.justify-between.items-center',
                h('h5', 'Active filters'),
                h('button.btn.btn-secondary.font-size-small', {
                    onclick: () => onClearAll(),
                }, 'Clear all'))),
        h('.flex-wrap.items-center.chips',
            filtersFromUrl(url).map((filter) => [
                h('.chip.filter-chip.inline',
                    h('.filter-field.inline', filter.field),
                    h('.filter-type.inline', filter.type),
                    h('.filter-input.inline', filter.search),
                    h('button.btn.icon-only-button.transparent', {
                        onclick: () => {
                            onClearFilter(filter);
                        },
                    }, h('.close-10-primary'))),
            ])),
    ];
}
