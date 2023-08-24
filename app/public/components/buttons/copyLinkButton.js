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
import snackBar from '../snackBars/snackBar.js';

/**
 * @param {string} url - url that will be returned to the user
 * @returns a button that once clicked will add the url to the user's clipboard
 */

export default function copyLinkButton(url) {
    const snackBarId = `${url}-copied`;
    const thisButtonId = `${url}-copy-link-button`;
    const thisButtonContentId = `${thisButtonId}-content`;

    return h('button.btn.btn-secondary.icon-only-button', {
        id: thisButtonId,
        onclick: () => {
            navigator.clipboard.writeText(url)
                .then(() => {
                    const snackbar = document.getElementById(snackBarId);
                    const thisButton = document.getElementById(thisButtonId);
                    const thisButtonContent = document.getElementById(thisButtonContentId);
                    snackbar.style.display = 'flex';

                    document.addEventListener('click', (event) => {
                        if (thisButton !== event.target && thisButtonContent !== event.target) {
                            snackbar.style.display = 'none';
                        }
                    });
                })
                .catch((e) => {
                    snackBar(e, snackBarId);
                });
        },
    }, h('.link-20-primary.abs-center', {
        id: thisButtonContentId,
    }), snackBar(h('.flex-row.items-center.gap-0-5', h('.done-10-primary'), 'Copied!'), snackBarId));
}
