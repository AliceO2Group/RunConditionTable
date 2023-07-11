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
import { RCT } from '../../../config.js';
import sidebarItem from './sidebarItem.js';
const { pagesNames } = RCT;

/**
 * Provides navigation between particular views, is divide to sections,
 * each may contain many buttons corresponding to many fetched data
 * @param model
 * @returns {*}
 */

export default function sidebar(model) {
    return h('.sidebar.p3',
        h('.logo'),
        h('.flex-column.gap-20',
            h('.sidebar-section',
                h('.sidebar-section-title', 'Pages'),
                sidebarItem(model, pagesNames.periods, 'Periods'),
                sidebarItem(model, pagesNames.dataPasses, 'Data Passes'),
                sidebarItem(model, pagesNames.anchoragePerDatapass, 'Anchorage per Data pass'),
                sidebarItem(model, pagesNames.mc, 'Monte Carlo'),
                sidebarItem(model, pagesNames.anchoredPerMC, 'Anchored per MC'),
                sidebarItem(model, pagesNames.runsPerPeriod, 'Runs per period'),
                sidebarItem(model, pagesNames.runsPerDataPass, 'Runs per Data pass'),
                sidebarItem(model, pagesNames.flags, 'QA flags')),

            h('.sidebar-section',
                h('.sidebar-section-title', 'Preferences'),
                h('', 'UI theme'),
                h('', 'List of detectors'),
                h('', 'Defined filters'))));
}
