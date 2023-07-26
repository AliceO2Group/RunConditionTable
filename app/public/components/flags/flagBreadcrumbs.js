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
import flagsIndexChip from './flagsIndexChip.js';
import title from '../table/title.js';
import { extractPeriodName } from '../../utils/dataProcessing/dataProcessingUtils.js';
import { RCT } from '../../config.js';
const { pageNames } = RCT;

export default function flagBreadCrumbs(model, dataPass, run, detector) {
    return [
        title(pageNames.flags),
        h('.forward-20'),
        flagsIndexChip(model.navigation, pageNames.dataPasses, extractPeriodName(dataPass), dataPass),
        h('.forward-20'),
        flagsIndexChip(model.navigation, pageNames.runsPerDataPass, dataPass, run),
        h('.forward-20'),
        h('h3.ph-15.text-primary', detector),
    ];
}
