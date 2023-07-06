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

import flagVisualization from './flagVisualization.js';
import flagsMockData from './flagsMockData.js';
import { h } from '/js/src/index.js';
import { RCT } from '../../../../config.js';

function filterDistinct(a) {
    return a.filter((value, index, array) => array.indexOf(value) === index);
}

export default function flagsVisualization(model) {
    const [runData] = model.fetchedData['runsPerPeriod'][Object.keys(model.fetchedData['runsPerPeriod'])[0]].payload.rows;
    const { time_start, time_end } = runData;
    const data = flagsMockData(runData.time_start, runData.time_end ? runData.time_end : runData.time_start + 50000);

    const distinctFlagReasons = filterDistinct(data.map((flag) => flag.flag.replace(/\s+/g, '')));

    const flagsGroupedByFlagReason = distinctFlagReasons.reduce((prev, curr) => {
        prev[curr] = data.filter((flag) => flag.flag.replace(/\s+/g, '') === curr);
        return prev;
    }, {});

    const flagColor = (flagReason) => {
        const colors = RCT.flagReasonColors;
        switch (flagReason) {
            case 'LimitedAcceptance':
                return colors.limitedAcceptance;
            case 'Notbad':
                return colors.neutral;
            default:
                return colors.bad;
        }
    };

    const flagReasonVisualization = (flagReason) => h('.flex-wrap.justify-between.items-center.pv1',
        h('.w-10', flagReason),
        flagVisualization(flagsGroupedByFlagReason[flagReason], time_start, time_end, flagColor(flagReason)));

    return h('.relative', distinctFlagReasons.map((flagReason) => flagReasonVisualization(flagReason)));
}
