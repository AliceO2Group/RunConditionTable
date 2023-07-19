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

const { dataReqParams } = RCT;
const { defaultDataReqParams } = RCT;

export default function activeFilters(model, url) {
    const data = model.getCurrentData();
    const dataPointer = model.getCurrentDataPointer();
    const { fields } = data;
    const baseUrl = `/?page=${dataPointer.page}&index=${dataPointer.index}`;
    const defaultUrlParams = `${dataReqParams.rowsOnSite}=${defaultDataReqParams.rowsOnSite}&${dataReqParams.site}=${defaultDataReqParams.site}`;
    const processedUrl = url.href.split('&').filter((item) => item.includes('match') || item.includes('exclude') || item.includes('between'));

    const activeFields = processedUrl.map((item) => {
        return {
            field: item.split('-')[0],
            type: item.split('=')[0].split('-')[1],
            filter: decodeURIComponent(item.split('=')[1])
        }
    });

    console.log(activeFields);

    function onClear() {
        const firstField = fields.find((f) => f !== undefined && f.name);
        const clearUrl = `${baseUrl}&${defaultUrlParams}&sorting=-${firstField.name}`;
        model.router.go(clearUrl);
    }

    return [
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-center',
                h('h5', 'Active filters'),
                h('button.btn.btn-secondary.font-size-small', {
                    onclick: () => onClear(),
                }, 'Clear all'))),
            h('.flex-wrap.items-center.chips',
                activeFields.map((field) => [
                    h('div.chip.filter-chip.inline',
                    h('.filter-field.inline', field.field),
                    h('.filter-type.inline', field.type),
                    h('.filter-input.inline', field.filter),
                    h('.close-10'))
    ]))];
}
