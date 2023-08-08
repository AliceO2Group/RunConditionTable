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
import { RCT } from '../../../../config.js';

export default function pageSettings(model, close) {
    const rowsPerPageInputId = 'rows-per-page-input-id-modal';
    const themeSelectId = 'theme-selection';
    const sidebarPreferenceSelectId = 'sidebar-selection';
    const sidebarPreferences = {
        visible: 'visible',
        collapsible: 'collapsible',
    };
    const title = h('h3.text-primary', 'Page settings');

    const onclickSetRowsOnSite = (model) => {
        const input = document.getElementById(rowsPerPageInputId);
        let rowsOnSite = input.value === '' ? input.placeholder : input.value;
        if (rowsOnSite < 1 || rowsOnSite > 200) {
            alert('incorrect number of rows on page: must be in range of [1, 200]');
            input.value = 50;
            rowsOnSite = 50;
        }
        model.fetchedData.changeRowsOnSite(rowsOnSite);
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
            case RCT.themes.ehevi:
                documentBody.classList.add(RCT.themes.ehevi);
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

    return h('', [
        h('.flex.bottom-20.justify-center.items-center',
            h('.settings-40-primary'),
            h('.inline.top-15.left-10',
                title)),

        h('.flex-wrap.justify-between.items-center',
            h('.text-dark-blue', 'Rows per page'),
            quantityInput(rowsPerPageInputId,
                model.router.params['rows-on-site'],
                model.fetchedData.changeRowsOnSite)),

        h('.flex-wrap.justify-between.items-center',
            h('.text-dark-blue', 'UI theme'),
            h('select.select.color-theme', {
                id: themeSelectId,
                name: themeSelectId,
                onchange: () => handleThemeSelection(),
            }, [
                h('option', { value: RCT.themes.ehevi }, 'Ehevi'),
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

        h('.flex-wrap.justify-center.items-center',
            h('button.btn.btn-primary.m1', {
                onclick: () => onclickSetRowsOnSite(model),
            }, 'Apply changes')),
    ]);
}
