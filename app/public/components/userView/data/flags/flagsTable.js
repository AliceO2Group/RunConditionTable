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

import flagsMockData from './flagsMockData.js';
import { h } from '/js/src/index.js';
import { RCT } from '../../../../config.js';
const { pagesNames: PN } = RCT;

export default function flagsTable(model) {
    const data = model.fetchedData[PN.flags];
    console.log(data);

    /*
     * Const [ runData ] = model.fetchedData['runsPerDataPass'][Object]
     * const [runData] = model.fetchedData['flags']
     */
    return 'flags table';
    // [Object.keys(model.fetchedData['runsPerPeriod'])[0]].payload.rows;
    // const data = flagsMockData(runData.time_start, runData.time_end ? runData.time_end : runData.time_start + 50000);

    const dateFormatter = (sec) => {
        const cestOffset = 2 * 60 * 60 * 1000;
        const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
        const d = new Date(Number(sec) + cestOffset + localOffset);
        const dateString = d.toLocaleDateString();
        const timeString = d.toLocaleTimeString();
        return h('', h('.skinny', dateString), timeString);
    };

    const lastChangeFormatter = (lastChange) => {
        const cestOffset = 2 * 60 * 60 * 1000;
        const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
        const d = new Date(Number(lastChange.time) + cestOffset + localOffset);
        const dateString = d.toLocaleDateString();
        return h('', h('.skinny', dateString), lastChange.person);
    };

    function itemProps(item) {
        const result = [];
        for (const [key, value] of Object.entries(item)) {
            result.push(h('td', ['start', 'end'].includes(key)
                ? dateFormatter(value)
                : key === 'lastChange' ? lastChangeFormatter(value) : value));
        }
        return result;
    }

    return h('.p-top-10',
        h('.x-scrollable-table.border-sh',
            h('table', {
                //Id: `data-table-${data.url}`,
                className: 'flags-table',
            }, [
                h('thead.header',
                    h('tr',
                        h('th', 'Start'),
                        h('th', 'End'),
                        h('th', 'Flag'),
                        h('th', 'Comment'),
                        h('th', 'Added by'),
                        h('th', 'Last change'))),

                h('tbody',
                    data.map((item) => h('tr.track', itemProps(item)))),
            ])));
}
