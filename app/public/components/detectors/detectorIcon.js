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

import qcTypeSelection from '../../views/runs/runsPerDataPass/overview/qcTypeSelection.js';
import { h } from '/js/src/index.js';

export default function detectorIcon(model, item, n, index, detectorName) {
    return [
        h('.modal', { id: 'qcTypeSelectionModal' },
            h('.modal-content.abs-center.p3', {
                id: 'qcTypeSelectionModalContent',
            }, qcTypeSelection(model, () => {
                document.getElementById('qcTypeSelectionModal').style.display = 'none';
            }, item, index, detectorName))),
        h('button.btn.transparent.tooltip.no-border-bottom.pointer', {
            onclick: () => {
                console.log(document.getElementById('qcTypeSelectionModal'));
                console.log('clicked!');
                document.getElementById('qcTypeSelectionModal').style.display = 'block';
                document.addEventListener('click', (event) => {
                    const modalContent = document.getElementsByClassName('modal-content');
                    const modal = document.getElementsByClassName('modal');
                    if (Array.from(modalContent).find((e) => e != event.target)
                    && Array.from(modal).find((e) => e == event.target)
                    && document.getElementById('qcTypeSelectionModal')) {
                        document.getElementById('qcTypeSelectionModal').style.display = 'none';
                    }
                });
            } },
        h('svg', { width: '20px', height: '20px' },
            h('circle',
                {
                    cx: '50%',
                    cy: '50%',
                    r: '8px', //

                    /*
                     *Stroke: '#F7B538', strokes for the limited acceptance flags only
                     *'stroke-width': '3',
                     */
                    fill: '#8CB369',
                })),
        h('span.detector-tooltip-field', `run_det_id: ${item[n]}`)),
    ];
}
