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
import viewButton from '../../../common/viewButton.js';
import spinner from '../../../common/spinner.js';

export default function spinnerAndReloadView(model) {
    let totalSeconds = 0;
    let counterId = undefined;

    function initCounter() {
        if (counterId !== undefined) {
            clearInterval(counterId);
            counterId = undefined;
            totalSeconds = 0;
        }
        if (counterId === undefined) {
            counterId = setInterval(setTime, 1000);
        }
    }

    function setTime() {
        const minutesLabel = document.getElementById('minutes');
        const secondsLabel = document.getElementById('seconds');
        ++totalSeconds;
        secondsLabel.innerHTML = pad(totalSeconds % 60);
        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
        const valString = `${val}`;
        if (valString.length < 2) {
            return `0${valString}`;
        } else {
            return valString;
        }
    }

    const pos = { x: 0, y: 0 };

    const saveCursorPosition = function (x, y) {
        pos.x = (x / window.innerWidth).toFixed(2);
        pos.y = (y / window.innerHeight).toFixed(2);
        document.documentElement.style.setProperty('--x', pos.x);
        document.documentElement.style.setProperty('--y', pos.y);
    };

    document.addEventListener('mousemove', (e) => {
        saveCursorPosition(e.clientX, e.clientY);
    });
    setTimeout(() => initCounter(), 10);

    const reloadBtn = viewButton(
        model,
        'Retry',
        () => {
            document.location.reload(true);
        },
        '',
        undefined,
        '.btn-primary.m3',
    );
    const loadingMessage = h('h3', 'Loading...');
    const counter = h('h5.inline',
        h('span.clear-both', { id: 'minutes' }, '00'),
        h('span.clear-both', ':'),
        h('span.clear-both', { id: 'seconds' }, '00'),
        h('.tooltiptext2.tracker.p2.br3',
            'If you are seeing this for way too long, then probably something is messed up'));

    return h('.loginDiv.top-100', [
        h('.my-tooltip-bg',
            spinner(),
            loadingMessage,
            counter),
        reloadBtn,
    ]);
}
