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
import { RCT } from '../../config.js';
const { runBasedQuality } = RCT.quality;

export default function detectorIcon(navigation, item, index, detectorName) {
    const runDetectorId = `${index}-${item.run_number}-${detectorName}`;
    const runBasedQcModalId = `${runDetectorId}-qc-modal`;
    return [
        h('.modal', { id: runBasedQcModalId },
            h('.modal-content.abs-center.p3', {
                id: `${runBasedQcModalId}-content`,
            }, qcTypeSelection(navigation, () => {
                document.getElementById(runBasedQcModalId).style.display = 'none';
            }, item, index, detectorName, runDetectorId))),
        h('button.btn.no-border-bottom.pointer.run-quality.good', {
            id: runDetectorId,
            onclick: () => {
                document.getElementById(runBasedQcModalId).style.display = 'block';
                document.addEventListener('click', (event) => {
                    const modalContent = document.getElementsByClassName('modal-content');
                    const modal = document.getElementsByClassName('modal');
                    if (Array.from(modalContent).find((e) => e != event.target)
                    && Array.from(modal).find((e) => e == event.target)
                    && document.getElementById(runBasedQcModalId)) {
                        document.getElementById(runBasedQcModalId).style.display = 'none';
                    }
                });
            } },
        runBasedQuality.good),
    ];
}
