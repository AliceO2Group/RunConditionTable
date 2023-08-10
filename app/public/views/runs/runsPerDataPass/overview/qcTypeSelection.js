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
import { RCT } from '../../../../config.js';
const { runBasedQuality } = RCT.quality;

export default function qcTypeSelection(navigation, close, item, index, detectorName, runDetectorId, timeBased) {
    const flagsUrl = `/?page=flags&data_pass_name=${index}&run_numbers=${item.run_number}&detector=${detectorName}&rows-on-site=50&site=1`;
    const runQualitySelectId = 'run-quality-select';

    function handleRunQualityChange() {
        const detectorIcon = document.getElementById(runDetectorId);
        const runQualitySelection = document.getElementById(runQualitySelectId);
        const selectedQuality = runQualitySelection.options[runQualitySelection.selectedIndex].value;
        switch (selectedQuality) {
            case '0':
                if (detectorIcon.classList.contains(runBasedQuality.bad)) {
                    detectorIcon.classList.remove(runBasedQuality.bad);
                    detectorIcon.classList.add(runBasedQuality.good);
                    detectorIcon.innerHTML = runBasedQuality.good;
                }
                break;
            case '1':
                if (detectorIcon.classList.contains(runBasedQuality.good)) {
                    detectorIcon.classList.remove(runBasedQuality.good);
                    detectorIcon.classList.add(runBasedQuality.bad);
                    detectorIcon.innerHTML = runBasedQuality.bad;
                }
                break;
            default:
                break;
        }
    }

    return h('', [
        h('.flex.items-center',
            h('h6.inline.top-15.p-left-1em', index)),
        h('.flex.p-bottom-1em.items-center',
            h('h3.inline.top-15.p-left-1em', item.run_number),
            h('h3.inline.top-15.p-left-1em', detectorName)),
        h('.flex-wrap.justify-between.items-center',
            h('', 'Run quality'),
            h('select.select.color-theme', {
                id: runQualitySelectId,
                name: runQualitySelectId,
                onchange: () => handleRunQualityChange(),
            }, [
                h('option', { value: 0 }, runBasedQuality.good),
                h('option', { value: 1 }, runBasedQuality.bad),
            ], iconChevronBottom())),

        timeBased
            ? h('.flex-wrap.justify-center.items-center',
                h('button.btn.btn-primary.m1', {
                    onclick: () => navigation.router.go(flagsUrl),
                }, 'Time based quality'))
            : '',
    ]);
}
