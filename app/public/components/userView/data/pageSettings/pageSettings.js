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

export default function pageSettings(model) {
    const loginButton = h('button.btn', 'Login');
    const title = h('h3', 'Page settings');

    function onclickSetRowsOnSite(model, scid) {
        const input = document.getElementById(`rows-on-site-input-${scid}`);
        let rowsOnSite = input.value === '' ? input.placeholder : input.value;
        if (rowsOnSite < 1 || rowsOnSite > 200) {
            alert('incorrect number of rows on page: must be in range of [1, 200]');
            input.value = 50;
            rowsOnSite = 50;
        }
        model.fetchedData.changeRowsOnSite(rowsOnSite);
        // CLOSE MODAL HERE document.getElementsByClassName('modal').display=none
    }
    
    return h('.pageSettings', [
        h('.flex.bottom-20',
            h('.settings-90'),
            h('.inline.top-15.left-10',
                title)),
        h('.menu-title', 'Rows per page'),
        h('input.pager.p2', {
            id: `rows-on-site-input-3`,
            type: 'number',
            placeholder: 50,
            value: model.router.params['rows-on-site'],
        }, ''),
        h('button.btn.btn-primary.m1', { onclick: () => onclickSetRowsOnSite(model, 3) }, 'Apply changes'),
    ]);
}
