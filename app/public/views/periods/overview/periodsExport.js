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

export default function periodsExport(userPreferences, close) {
    const rowsPreferenceSelectId = 'rows-preference-selection';
    const columnsPreferenceSelectId = 'columns-preference-selection';
    const exportPreferences = {
        all: 'all',
        currentPage: 'currentPage',
        selected: 'selected',
        notSelected: 'notSelected',
        visible: 'visible',
    };
    const title = h('h3.text-primary', 'Export');

    const exportData = () => {
        close();
    };

    const handleRowsPreferenceSelection = () => {
        const exportPreferenceSelection = document.getElementById(rowsPreferenceSelectId);
        const selectedPreference = exportPreferenceSelection.options[exportPreferenceSelection.selectedIndex].value;
        switch (selectedPreference) {
            case exportPreferences.all:
                /* */
                break;
            case exportPreferences.currentPage:
                /* */
                break;
            case exportPreferences.selected:
                /* */
                break;
            case exportPreferences.notSelected:
                /* */
                break;
            case exportPreferences.visible:
                /* */
                break;
            default:
                break;
        }
    };

    const handleColumnsPreferenceSelection = () => {
        const exportPreferenceSelection = document.getElementById(columnsPreferenceSelectId);
        const selectedPreference = exportPreferenceSelection.options[exportPreferenceSelection.selectedIndex].value;
        switch (selectedPreference) {
            case exportPreferences.all:
                /* */
                break;
            case exportPreferences.selected:
                /* */
                break;
            case exportPreferences.notSelected:
                /* */
                break;
            case exportPreferences.visible:
                /* */
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
            h('.text-dark-blue', 'Rows'),
            h('select.select.color-theme', {
                id: rowsPreferenceSelectId,
                name: rowsPreferenceSelectId,
                onchange: () => handleRowsPreferenceSelection(),
            }, [
                h('option', { value: exportPreferences.all }, 'All'),
                h('option', { value: exportPreferences.currentPage }, 'Current page'),
                h('option', { value: exportPreferences.selected }, 'Selected rows'),
                h('option', { value: exportPreferences.notSelected }, 'Not selected rows'),
                h('option', { value: exportPreferences.visible }, 'Visible rows'),
            ], iconChevronBottom())),

        h('.flex-wrap.justify-between.items-center',
            h('.text-dark-blue', 'Columns'),
            h('select.select.color-theme', {
                id: rowsPreferenceSelectId,
                name: rowsPreferenceSelectId,
                onchange: () => handleColumnsPreferenceSelection(),
            }, [
                h('option', { value: exportPreferences.all }, 'All'),
                h('option', { value: exportPreferences.selected }, 'Selected columns'),
                h('option', { value: exportPreferences.notSelected }, 'Not selected columns'),
                h('option', { value: exportPreferences.notSelected }, 'Visible columns'),
            ], iconChevronBottom())),

        h('.flex-wrap.justify-center.items-center.p-1rem.p-bottom-0',
            h('button.btn.btn-primary', {
                onclick: () => exportData(),
            }, 'Apply changes')),
    ]);
}
