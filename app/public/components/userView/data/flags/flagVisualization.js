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

const width = '5000';
const height = '100';

export default function flagVisualization(flag, start, end, colorHexCode) {
    const run_length = end - start;

    return h('canvas', {
        width: width,
        height: height,
        oncreate: (vnode) => draw(vnode.dom, colorHexCode, flag, run_length, start),
        onupdate: (vnode) => draw(vnode.dom, colorHexCode, flag, run_length, start),
    });
}

function draw(dom, colorHexCode, flag, run_length, start) {
    const ctx = dom.getContext('2d');
    ctx.fillStyle = `#${colorHexCode}`;

    for (const f of flag) {
        ctx.fillRect(getFlagCoordinates(f, start, run_length).x_start, 0, getFlagCoordinates(f, start, run_length).x_length, height);
    }
}

function getFlagCoordinates(flag, start, run_length) {
    const x_start = (flag.time_start - start) * width / run_length;
    const x_length = (flag.time_end - flag.time_start) * width / run_length;
    return { x_start: x_start, x_length: x_length };
}
