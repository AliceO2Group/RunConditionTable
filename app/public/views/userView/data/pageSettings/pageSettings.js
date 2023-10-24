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

import { h, iconChevronBottom } from '/js/src/index.js';
import quantityInput from '../../../../components/common/quantityInput.js';
const RCT = window.RCT_CONF;

export default function pageSettings(userPreferences, close) {
    const itemsPerPageInputId = 'rows-per-page-input-id-modal';
    const themeSelectId = 'theme-selection';
    const sidebarPreferenceSelectId = 'sidebar-selection';
    const sidebarPreferences = {
        visible: 'visible',
        collapsible: 'collapsible',
    };
    const title = h('h3.text-primary', 'Page settings');

    const onclickApply = (userPreferences) => {
        const input = document.getElementById(itemsPerPageInputId);
        const inputValue = input.value === '' ? input.placeholder : input.value;
        if (inputValue < 1 || inputValue > 200) {
            alert('incorrect number of rows on page: must be in range of [1, 200]');
            input.value = userPreferences.itemsPerPage;
        } else {
            userPreferences.setItemsPerPage(inputValue);
        }
        close();
    };

    const removeAllThemeClasses = (element) => {
        for (const theme of Object.keys(RCT.themes)) {
            if (element.classList.contains(theme)) {
                element.classList.remove(theme);
            }
        }
    };

    const handleThemeSelection = () => {
        const documentBody = document.getElementById('body');
        const themesSelection = document.getElementById(themeSelectId);
        const selectedTheme = themesSelection.options[themesSelection.selectedIndex].value;
        removeAllThemeClasses(documentBody);
        switch (selectedTheme) {
            case RCT.themes.rct:
                documentBody.classList.add(RCT.themes.rct);
                break;
            case RCT.themes.webui:
                documentBody.classList.add(RCT.themes.webui);
                break;
            default:
                break;
        }
    };

    const handleSidebarPreferenceSelection = () => {
        const sidebar = document.getElementById('sidebar');
        const visibleSidebarClassName = 'sidebar-visible';
        const collapsibleSidebarClassName = 'sidebar-collapsible';
        const collapsible = document.getElementsByClassName(collapsibleSidebarClassName);
        const visible = document.getElementsByClassName(visibleSidebarClassName);
        const sidebarPreferenceSelection = document.getElementById(sidebarPreferenceSelectId);
        const selectedPreference = sidebarPreferenceSelection.options[sidebarPreferenceSelection.selectedIndex].value;
        switch (selectedPreference) {
            case sidebarPreferences.collapsible:
                if (collapsible.length) {
                    return;
                }
                sidebar?.classList.remove(visibleSidebarClassName);
                sidebar?.classList.add(collapsibleSidebarClassName);
                break;
            case sidebarPreferences.visible:
                if (visible.length) {
                    return;
                }
                sidebar?.classList.remove(collapsibleSidebarClassName);
                sidebar?.classList.add(visibleSidebarClassName);
                break;
            default:
                break;
        }
    };

    return h('.p-1rem', [
        h('.flex.p-bottom-1rem.justify-center.items-center',
            h('.settings-40-primary'),
            h('.p-left-1rem', title)),

        h('.flex-wrap.justify-between.items-center',
            h('.text-dark-blue', 'Items per page'),
            quantityInput(itemsPerPageInputId,
                userPreferences.itemsPerPage)),

        h('.flex-wrap.justify-between.items-center',
            h('.text-dark-blue', 'UI theme'),
            h('select.select.color-theme', {
                id: themeSelectId,
                name: themeSelectId,
                onchange: () => handleThemeSelection(),
            }, [
                h('option', { value: RCT.themes.rct }, 'RCT'),
                h('option', { value: RCT.themes.webui }, 'WebUI'),
            ], iconChevronBottom())),

        h('.flex-wrap.justify-between.items-center',
            h('.text-dark-blue', 'Sidebar'),
            h('select.select.color-theme', {
                id: sidebarPreferenceSelectId,
                name: sidebarPreferenceSelectId,
                onchange: () => handleSidebarPreferenceSelection(),
            }, [
                h('option', { value: sidebarPreferences.collapsible }, 'Collapsible'),
                h('option', { value: sidebarPreferences.visible }, 'Always visible'),
            ], iconChevronBottom())),

        h('.flex-wrap.justify-center.items-center.p-1rem.p-bottom-0',
            h('button.btn.btn-primary', {
                onclick: () => onclickApply(userPreferences),
            }, 'Apply changes')),
    ]);
}
