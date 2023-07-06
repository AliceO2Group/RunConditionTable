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

export default function flagsVisualization(model) {
    const [runData] = model.fetchedData['runsPerPeriod'][Object.keys(model.fetchedData['runsPerPeriod'])[0]].payload.rows;
    const data = flagsMockData(runData.time_start, runData.time_end ? runData.time_end : runData.time_start + 50000);

    const distinctFlagReasons = data.map((flag) => flag.flag).filter((value, index, array) => array.indexOf(value) === index);

    const flagsGroupedByFlagReason = distinctFlagReasons.reduce((prev, curr) => {
        prev[curr.replace(/\s+/g, '')] = data.filter((flag) => flag.flag === curr);
        return prev;
    }, {});

    return h('.relative',
        Object.keys(flagsGroupedByFlagReason).map((flagReason) => flagVisualization(flagsGroupedByFlagReason[flagReason], runData.time_start, runData.time_end, '277DA1')));
}
