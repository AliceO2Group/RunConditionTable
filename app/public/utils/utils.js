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

export const zip = (a, b) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);

export function getReadableFileSizeString(fileSizeInBytes) {
    let i = -1;
    const byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes /= 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return `${Math.max(fileSizeInBytes, 0.1).toFixed(1)}  ${byteUnits[i]}`;
}

/**
 * Returns an object composed of the picked object properties
 *
 * @param {Object} obj The source object.
 * @param {Array} keys The property paths to pick.
 * @returns {Object} Returns the new object.
 */
export const pick = (obj, keys) => Object.fromEntries(Object.entries(obj)
    .filter(([key]) => keys.includes(key)));
