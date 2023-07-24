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

export default function qcTypeSelection(navigation, close, item, index, detectorName, runDetectorId) {
    const flagsUrl = `/?page=flags&data_pass_name=${index}&run_numbers=${item.run_number}&detector=${detectorName}&rows-on-site=50&site=1`;
    const runQualitySelectId = 'run-quality-select';

    function handleRunQualityChange() {
        const detectorIcon = document.getElementById(runDetectorId);
        const runQualitySelection = document.getElementById(runQualitySelectId);
        const selectedQuality = runQualitySelection.options[runQualitySelection.selectedIndex].value;
        switch (selectedQuality) {
            case '0':
                if (detectorIcon.classList.contains('bad')) {
                    detectorIcon.classList.remove('bad');
                    detectorIcon.classList.add('good');
                    detectorIcon.innerHTML = 'good';
                }
                break;
            case '1':
                if (detectorIcon.classList.contains('good')) {
                    detectorIcon.classList.remove('good');
                    detectorIcon.classList.add('bad');
                    detectorIcon.innerHTML = 'bad';
                }
                break;
            default:
                break;
        }
    }

    return h('', [
        h('.flex.items-center',
            h('h6.inline.top-15.left-10', index)),
        h('.flex.bottom-20.items-center',
            h('h3.inline.top-15.left-10', item.run_number),
            h('h3.inline.top-15.left-10', detectorName)),
        h('.flex-wrap.justify-between.items-center',
            h('', 'Run quality'),
            h('select.select.color-theme', {
                id: runQualitySelectId,
                name: runQualitySelectId,
                onchange: () => handleRunQualityChange(),
            }, [
                h('option', { value: 0 }, 'good'),
                h('option', { value: 1 }, 'bad'),
            ], iconChevronBottom())),

        h('.flex-wrap.justify-center.items-center',
            h('button.btn.btn-primary.m1', {
                onclick: () => navigation.router.go(flagsUrl),
            }, 'Time based quality')),
    ]);
}
