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

export default function copyLinkButton(url) {
    const snackBarId = `${url}-copied`;
    const thisButtonId = `${url}-copy-link-button`;
    const thisButtonContentId = `${thisButtonId}-content`;

    /*
     *Document.addEventListener('click', (event) => {
     *    const modalContent = document.getElementsByClassName('modal-content');
     *    const modal = document.getElementsByClassName('modal');
     *    if ((Array.from(modalContent).find((e) => e == event.target)
     *        || Array.from(modal).find((e) => e == event.target))
     *        && document.getElementById('myModal')) {
     *        document.getElementById('myModal').style.display = 'none';
     *    }
     *});
     *
     */

    return h('button.btn.btn-secondary.icon-only-button', {
        id: thisButtonId,
        onclick: () => {
            navigator.clipboard.writeText(url)
                .then(() => {
                    const snackbar = document.getElementById(snackBarId);
                    const thisButton = document.getElementById(thisButtonId);
                    const thisButtonContent = document.getElementById(thisButtonContentId);
                    snackbar.style.display = 'block';

                    document.addEventListener('click', (event) => {
                        if (thisButton != event.target && thisButtonContent != event.target) {
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
    }), snackBar('Copied!', snackBarId));
}
