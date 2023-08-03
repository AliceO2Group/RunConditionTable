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
import { RCT } from '../../config.js';
import sidebarItem from './sidebarItem.js';
import { modal, modalIds, showModal } from '../../views/modal/modal.js';
const { pageNames } = RCT;

/**
 * Provides navigation between particular views, is divide to sections,
 * each may contain many buttons corresponding to many fetched data
 * @param model
 * @returns {*}
 */

export default function sidebar(model) {
    return h('.sidebar.p3',
        modal(modalIds.about.modal),
        modal(modalIds.pageSettings.modal, model),
        h('.logo.hide-on-close'),
        h('.flex-column.gap-20',
            h('.sidebar-section',
                h('.sidebar-section-title.hide-on-close', 'Pages'),
                sidebarItem(model, pageNames.periods, 'Periods'),
                sidebarItem(model, pageNames.dataPasses, 'Data Passes'),
                sidebarItem(model, pageNames.anchoragePerDatapass, 'Anchorage per Data pass'),
                sidebarItem(model, pageNames.mc, 'Monte Carlo'),
                sidebarItem(model, pageNames.anchoredPerMC, 'Anchored per MC'),
                sidebarItem(model, pageNames.runsPerPeriod, 'Runs per period'),
                sidebarItem(model, pageNames.runsPerDataPass, 'Runs per Data pass'),
                sidebarItem(model, pageNames.flags, 'QA flags')),

            h('.sidebar-section',
                h('.sidebar-section-title.hide-on-close', 'Preferences'),
                h('button.sidebar-item-button', {
                    onclick: () => showModal(modalIds.pageSettings.modal) },
                h('.flex-wrap.page-title',
                    h('.settings-20-off-white.vertical-center'),
                    h('.title-text.vertical-center.hide-on-close', 'Page settings'))),

                h('button.sidebar-item-button', {
                    onclick: () => showModal(modalIds.about.modal),
                },
                h('.flex-wrap.page-title.justify-center.items-center',
                    h('.detector-15-off-white'),
                    h('.title-text.hide-on-close', 'dett'))),

                h('.flex-wrap.page-title.justify-center.items-center',
                    h('.detector-15-off-white.vertical-center'),
                    h('.title-text.vertical-center.hide-on-close', 'Detectors'))),

            h('.sidebar-section',
                h('button.sidebar-item-button', {
                    onclick: () => showModal(modalIds.about.modal),
                },
                h('.flex-wrap.page-title',
                    h('.about-15-off-white.vertical-center'),
                    h('.title-text.vertical-center.hide-on-close', 'About'))))));
}
