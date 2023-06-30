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
import indexChip from './indexChip.js';

export default function noSubPageSelected(model) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;

    const chips = model.getSubPages(dataPointer.page).filter((index) => index !== defaultIndexString).map((index) => indexChip(model, index));

    data.rows = data.rows.filter((item) => item.name != 'null');

    const headerSpecific = (model) => {
        const { page } = model.getCurrentDataPointer();
        switch (page) {
            case 'periods': return 'Periods';
            case 'runsPerPeriod': return 'Runs per period';
            case 'runsPerDataPass': return 'Runs per data pass';
            case 'dataPasses': return 'Data passes per period';
            case 'mc': return 'Monte Carlo';
            case 'flags': return 'Flags';
            case 'anchoragePerDatapass': return 'Anchorage per data pass';
            case 'anchoredPerMC': return 'Anchored per MC';
            default: return page;
        }
    };

    return h('div.main-content', [
        h('div.flex-wrap.justify-between.items-center',
            h('div.flex-wrap.justify-between.items-baseline',
                h('h3.p-left-15.text-primary', headerSpecific(model)),
                chips)),

        'Please select any of the subpages',
    ]);
}
