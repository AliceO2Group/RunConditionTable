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

window.addEventListener('click', (event) => {
    const modalContent = document.getElementsByClassName('modal-content');
    const modal = document.getElementsByClassName('modal');
    if ((Array.from(modalContent).find((e) => e == event.target)
        || Array.from(modal).find((e) => e == event.target))
        && document.getElementById('myModal')) {
        document.getElementById('myModal').style.display = 'none';
    }
});

export default function modal(content, modalId = 'myModal') {
    return h('.modal', { id: modalId },
        h('.modal-content', content));
}
