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

export default function flagVisualization() {
  const defaults = {
    series: [], // [{value:number, timestamp:number:ms}]
    background: 'white',
    colorPrimary: 'black',
    colorSecondary: 'gray',
    title: '',
    devicePixelRatio: window.devicePixelRatio, // default=1, retina=2, higher=3
    timeWindow: 1000, // how many ms to represent in the width available
  };
  // const options = Object.assign({}, defaults, userOptions);

  const options = defaults;

  // Canvas is 2x bigger than element, to handle high resolution (retina)
  return h('canvas', {
    width: '100',
    height: '100',
    oncreate: (vnode) => draw(vnode.dom),
    onupdate: (vnode) => draw(vnode.dom),
  });
}

function draw(dom) {
    const ctx = dom.getContext('2d');
    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillRect(0, 0, 10, 50);

    ctx.fillRect(20, 0, 20, 50);

    ctx.fillRect(90, 0, 20, 50);
}

/**
 * Comparison function to sort points by `timestamp` field
 * @param {Object} pointA - {value:number, timestamp:number:ms}
 * @param {Object} pointB - {value:number, timestamp:number:ms}
 * @return {number}
 */
const sortByTimestamp = (pointA, pointB) => pointA.timestamp - pointB.timestamp;

/**
 * Find the maximum '.value' of array of points
 * @param {Array.<Point>} points
 * @return {number}
 */
const maxOf = (points) => points.reduce(
  (max, point) => point.value > max ? point.value : max,
  -Infinity
);

/**
 * Find the minimum '.value' of array of points
 * @param {Array.<Point>} points
 * @return {number}
 */
const minOf = (points) => points.reduce(
  (min, point) => point.value < min ? point.value : min,
  +Infinity
);
