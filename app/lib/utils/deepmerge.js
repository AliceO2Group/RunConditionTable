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

const deepmerge = require('deepmerge');

function isMergeableObject(value) {
    return isNonNullObject(value)
		&& !isSpecial(value);
}

function isNonNullObject(value) {
    return Boolean(value) && typeof value === 'object';
}

function isSpecial(value) {
    const stringValue = Object.prototype.toString.call(value);
    const { constructor } = Object.getPrototypeOf(value);

    return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
        || /.*[Ss]equelize.*/.test(constructor)
        || typeof value === 'function';
}

const customDeepmerge = (x, y, opts) => deepmerge(x, y, { isMergeableObject, ...opts });
customDeepmerge.all = (arr, opts) => deepmerge(arr, { isMergeableObject, ...opts });

module.exports = {
    isMergeableObject,
    deepmerge: customDeepmerge,
};
