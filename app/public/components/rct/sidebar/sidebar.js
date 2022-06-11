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
import fetchedDataPages from './fetchedDataPages.js';
import alonePageButton from './alonePageButton.js';
import { RCT } from '../../../config.js';
const { pagesNames } = RCT;

/**
 * Provides navigation between particular views, is divide to sections,
 * each may contain many buttons corresponding to many fetched data
 * @param model
 * @returns {*}
 */

export default function sidebar(model) {
    return h('nav.sidebar.sidebar-content.scroll-y.flex-column', [sidebarMenu(model)]);
}
const sidebarMenu = (model) => [
    alonePageButton(model, 'Periods', pagesNames.periods),
    fetchedDataPages(model, pagesNames.dataPasses, 'Data Passes'),
    fetchedDataPages(model, pagesNames.mc, 'Monte Carlo'),
    fetchedDataPages(model, pagesNames.runsPerPeriod, 'Runs per period'),
    fetchedDataPages(model, pagesNames.flags, 'QA Expert Flagging'),
];
