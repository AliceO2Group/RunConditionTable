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

export default function pageSettings(model, close) {
    const rowsPerPageInputId = 'rows-per-page-input-id-modal';
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
        // CLOSE MODAL HERE document.getElementsByClassName('modal').display=none
    }

    return h('.pageSettings', [
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
            h('', 'Color theme'),
            h('select.select.color-theme', { id: 'showOptions', name: 'showOptions' }, [
                h('option', 'Ehevi'),
                h('option', 'WebUI'),
                h('option', 'Alice'),
                h('option', 'Chiara'),
            ], iconChevronBottom())),

        h('.flex-wrap.justify-center.items-center',
            h('button.btn.btn-primary.m1', {
                onclick: () => onclickSetRowsOnSite(model),
            }, 'Apply changes')),
    ]);
}
