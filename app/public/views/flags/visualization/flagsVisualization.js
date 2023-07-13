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
import { h } from '/js/src/index.js';
import { RCT } from '../../../../config.js';
const { pageNames: PN } = RCT;

function filterDistinct(a) {
    return a.filter((value, index, array) => array.indexOf(value) === index);
}

const dateFormatter = (sec) => {
    const cestOffset = 2 * 60 * 60 * 1000;
    const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const d = new Date(Number(sec) + cestOffset + localOffset);
    const dateString = d.toLocaleDateString();
    const timeString = d.toLocaleTimeString();
    return h('', h('.skinny', dateString), timeString);
};

export default function flagsVisualization(model, dataPass, run, flagsData) {
    const runData = model.fetchedData[PN.runsPerDataPass][dataPass].payload.rows.find((e) => e.run_number.toString() === run.toString());
    const { time_start, time_end } = runData;

    const distinctFlagReasons = filterDistinct(flagsData.map((flag) => flag.flag_reason.replace(/\s+/g, '')));

    const flagsGroupedByFlagReason = distinctFlagReasons.reduce((prev, curr) => {
        prev[curr] = flagsData.filter((flag) => flag.flag_reason.replace(/\s+/g, '') === curr);
        return prev;
    }, {});

    const flagColor = (flagReason) => {
        const colors = RCT.flagReasonColors;
        switch (flagReason) {
            case 'LimitedAcceptance':
                return colors.limitedAcceptance;
            case 'Notbad':
                return colors.neutral;
            case 'CertifiedbyExpert':
                return colors.neutral;
            case 'UnknownQuality':
                return colors.neutral;
            default:
                return colors.bad;
        }
    };

    const flagReasonVisualization = (flagReason) => h('.flex-wrap.justify-between.items-center.pv1',
        h('.w-10', flagReason),
        flagVisualization(flagsGroupedByFlagReason[flagReason], time_start, time_end, flagColor(flagReason)));

    return [
        h('.relative', distinctFlagReasons.map((flagReason) => flagReasonVisualization(flagReason))),
        h('.relative',
            h('.flex-wrap.justify-between.items-center.pv1',
                h('.w-10', ''),
                h('.w-90.flex-wrap.justify-between.items-center',
                    h('', dateFormatter(time_start), h('.skinny', 'START')),
                    h('', dateFormatter(time_end), h('.skinny', 'END'))))),
    ];
}
