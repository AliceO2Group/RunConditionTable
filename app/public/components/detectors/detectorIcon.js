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
import { showModal } from '../../views/modal/modal.js';

export default function detectorIcon(navigation, item, index, detectorName, timeBased = false, qualityChangePossible = false) {
    const runDetectorId = `${index}-${item.run_number}-${detectorName}`;
    const runBasedQcModalId = `${runDetectorId}-qc-modal`;
    const runDetectorQualityControlFlag = item[`${detectorName.toLowerCase()}_detector`];

    const { qcf, qcf_bkp } = runDetectorQualityControlFlag;
    const quality = qcf?.quality || qcf_bkp?.quality || 'NoData';
    const qcFromBookkeeping = ! qcf?.quality && qcf_bkp?.quality;
    return [
        qualityChangePossible
            ? h('.modal', { id: runBasedQcModalId },
                h('.modal-content.abs-center.p3', {
                    id: `${runBasedQcModalId}-content`,
                }, qcTypeSelection(navigation, () => {
                    document.getElementById(runBasedQcModalId).style.display = 'none';
                }, item, index, detectorName, runDetectorId, timeBased)))
            : '',

        h(`button.btn.pointer.run-quality.${quality}`, {
            id: runDetectorId,
            onclick: () => {
                if (qualityChangePossible) {
                    showModal(runBasedQcModalId);
                }
            },
        },
        quality, h('sub', qcFromBookkeeping ? 'sync' : '')),
    ];
}
