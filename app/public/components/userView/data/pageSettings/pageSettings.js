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
import quantityInput from '../../../common/quantityInput.js';
import { RCT } from '../../../../config.js';

export default function pageSettings(model, close) {
    const rowsPerPageInputId = 'rows-per-page-input-id-modal';
    const themeSelectId = 'theme-selection';
    const title = h('h3', 'Page settings');

    function onclickSetRowsOnSite(model) {
        const input = document.getElementById(rowsPerPageInputId);
        let rowsOnSite = input.value === '' ? input.placeholder : input.value;
        if (rowsOnSite < 1 || rowsOnSite > 200) {
            alert('incorrect number of rows on page: must be in range of [1, 200]');
            input.value = 50;
            rowsOnSite = 50;
        }
        model.fetchedData.changeRowsOnSite(rowsOnSite);
        close();
    }

    function removeAllThemeClasses(element) {
        for (const theme of Object.keys(RCT.themes)) {
            if (element.classList.contains(theme)) {
                element.classList.remove(theme);
            }

            for (const element of Object.keys(RCT.themes[theme])) {
                document.querySelectorAll(element).forEach((e) => {
                    const classes = RCT.themes[theme][element].split(' ');
                    classes.forEach((className) => {
                        e.classList.remove(className);
                    });
                });
            }
        }
    }

    function assignCustomThemeClasses(theme) {
        for (const element of Object.keys(RCT.themes[theme])) {
            for (const className of RCT.themes[theme][element].split(' ')) {
                document.querySelectorAll(element).forEach((e) => {
                    e.classList.add(className);
                });
            }
        }
    }

    function handleThemeSelection() {
        const documentBody = document.getElementById('body');
        const themesSelection = document.getElementById(themeSelectId);
        const selectedTheme = themesSelection.options[themesSelection.selectedIndex].value;
        removeAllThemeClasses(documentBody);
        switch (selectedTheme) {
            case '0':
                /* Ehevi */
                documentBody.classList.add(RCT.themeNames.ehevi);
                assignCustomThemeClasses(RCT.themeNames.ehevi);
                break;
            case '1':
                /* WebUI */
                assignCustomThemeClasses(RCT.themeNames.webui);
                break;
            default:
                break;
        }
    }

    return h('', [
        h('.flex.bottom-20.justify-center.items-center',
            h('.settings-40'),
            h('.inline.top-15.left-10',
                title)),

        h('.flex-wrap.justify-between.items-center',
            h('', 'Rows per page'),
            quantityInput(rowsPerPageInputId,
                model.router.params['rows-on-site'],
                model.fetchedData.changeRowsOnSite)),

        h('.flex-wrap.justify-between.items-center',
            h('', 'UI theme'),
            h('select.select.color-theme', {
                id: themeSelectId,
                name: themeSelectId,
                onchange: () => handleThemeSelection(),
            }, [
                h('option', { value: 0 }, 'Ehevi'),
                h('option', { value: 1 }, 'WebUI'),
                h('option', { value: 2 }, 'Alice'),
                h('option', { value: 3 }, 'Chiara'),
            ], iconChevronBottom())),

        h('.flex-wrap.justify-center.items-center',
            h('button.btn.btn-primary.m1', {
                onclick: () => onclickSetRowsOnSite(model),
            }, 'Apply changes')),
    ]);
}
