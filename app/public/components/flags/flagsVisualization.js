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
import flagVisualization from './flagVisualization.js';
import { RCT } from '../../config.js';
import { dateFormatter } from '../../utils/dataProcessing/dataProcessingUtils.js';
const { flagReasonColors } = RCT.quality;

function filterDistinct(a) {
    return a.filter((value, index, array) => array.indexOf(value) === index);
}

export default function flagsVisualization(runData, flagsData) {
    const { time_o2_start, time_o2_end, time_trg_start, time_trg_end } = runData;
    const time_start = time_trg_start ?? time_o2_start;
    const time_end = time_trg_end ?? time_o2_end;

    const distinctFlagReasons = filterDistinct(flagsData.map((flag) => flag.flag_reason.replace(/\s+/g, '')));

    const flagsGroupedByFlagReason = distinctFlagReasons.reduce((prev, curr) => {
        prev[curr] = flagsData.filter((flag) => flag.flag_reason.replace(/\s+/g, '') === curr);
        return prev;
    }, {});

    const flagColor = (flagReason) => {
        switch (flagReason) {
            case 'LimitedAcceptance':
            case 'Mixed':
                return flagReasonColors.limitedAcceptance;
            case 'Good':
                return flagReasonColors.good;
            case 'Notbad':
                return flagReasonColors.neutral;
            case 'CertifiedbyExpert':
                return flagReasonColors.neutral;
            case 'UnknownQuality':
                return flagReasonColors.neutral;
            default:
                return flagReasonColors.bad;
        }
    };

    const flagReasonVisualization = (flagReason) => h('.flex-wrap.justify-between.items-center.pv1',
        h('.w-10', flagReason),
        flagVisualization(flagsGroupedByFlagReason[flagReason], time_start, time_end, flagColor(flagReason)));

    return h('.p-top-05em', [
        h('.relative', distinctFlagReasons.map((flagReason) => flagReasonVisualization(flagReason))),
        h('.relative',
            h('.flex-wrap.justify-between.items-center.pv1',
                h('.w-10', ''),
                h('.w-90.flex-wrap.justify-between.items-center',
                    h('', dateFormatter(time_start), h('.skinny', 'START')),
                    h('', dateFormatter(time_end), h('.skinny', 'END'))))),
    ]);
}
