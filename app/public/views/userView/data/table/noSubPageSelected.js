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
import { defaultIndexString } from '../../../../utils/defaults.js';
import indexChip from '../../../../components/chips/indexChip.js';
import title from './title.js';

export default function noSubPageSelected(model) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;

    const chips = model.getSubPages(dataPointer.page)
        .filter((index) => index !== defaultIndexString)
        .map((index) => indexChip(model, dataPointer.page, index));

    data.rows = data.rows.filter((item) => item.name != 'null');

    return h('div.main-content', [
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-baseline',
                title(dataPointer.page),
                chips)),

        'Please select any of the subpages',
    ]);
}
