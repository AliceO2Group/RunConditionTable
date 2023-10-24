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
const RCT = window.RCT_CONF;
import sidebarItem from './sidebarItem.js';
import { modal, modalIds, showModal } from '../../views/modal/modal.js';
import { pageTitle } from '../common/pageTitle.js';
const { pageNames } = RCT;

/**
 * Provides navigation between particular views, is divide to sections,
 * each may contain many buttons corresponding to many fetched data
 * @param model
 * @returns {*}
 */

export default function sidebar(model) {
    const { userPreferences } = model.parent;
    return h('.sidebar.sidebar-collapsible', {
        id: 'sidebar',
    },
    modal(modalIds.about.modal),
    modal(modalIds.pageSettings.modal, null, userPreferences),
    modal(modalIds.detectors.modal, null, userPreferences),
    modal(modalIds.dataExport.modal, model.parent.periods, userPreferences),
    h('.logo.ph3.hide-on-close'),
    h('.flex-column.gap-20',
        h('.sidebar-section',
            h('.sidebar-section-title.ph2.hide-on-close', 'Pages'),
            sidebarItem(model, pageNames.periods, pageTitle(pageNames.periods, pageNames)),
            sidebarItem(model, pageNames.dataPasses, pageTitle(pageNames.dataPasses, pageNames)),
            sidebarItem(model, pageNames.anchoragePerDatapass, pageTitle(pageNames.anchoragePerDatapass, pageNames)),
            sidebarItem(model, pageNames.mc, pageTitle(pageNames.mc, pageNames)),
            sidebarItem(model, pageNames.anchoredPerMC, pageTitle(pageNames.anchoredPerMC, pageNames)),
            sidebarItem(model, pageNames.runsPerPeriod, pageTitle(pageNames.runsPerPeriod, pageNames)),
            sidebarItem(model, pageNames.runsPerDataPass, pageTitle(pageNames.runsPerDataPass, pageNames)),
            sidebarItem(model, pageNames.flags, pageTitle(pageNames.flags, pageNames))),

        h('.sidebar-section',
            h('.sidebar-section-title.ph2.hide-on-close', 'Preferences'),
            h('button.sidebar-item-button', {
                onclick: () => showModal(modalIds.pageSettings.modal),
            }, h('.page-title',
                h('.settings-15-off-white.vertical-center'),
                h('.title-text.vertical-center.hide-on-close', 'Page settings'))),

            h('button.sidebar-item-button', {
                onclick: () => showModal(modalIds.detectors.modal),
            }, h('.page-title',
                h('.detector-15-off-white.vertical-center'),
                h('.title-text.vertical-center.hide-on-close', 'Detectors')))),

        h('.sidebar-section',
            h('button.sidebar-item-button', {
                onclick: () => showModal(modalIds.about.modal),
            }, h('.page-title',
                h('.about-15-off-white.vertical-center'),
                h('.title-text.vertical-center.hide-on-close', 'About'))))));
}
