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

const basedeepmerge = require('deepmerge');

/**
 * Examine if value provided is mergeable @see {deepmerge}
 * @param {Object} value - value to be examined
 * @returns {boolean} result
 */
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

/**
 * Deepmerge utility from package {@link https://github.com/TehShrike/deepmerge} with customized `isMergeableObject` function.
 * Base function does not handle Sequelize objects e.g. of type Fn (Sequlize.fn) properly (corrupt them).
 * @param {Object} x - first object
 * @param {Object} y - second object, to be merged into first one (potentially replaces its property values)
 * @param {Object} opts - merging options
 * @returns {Object} result of merging
 */
function deepmerge(x, y, opts) {
    return basedeepmerge(x, y, { isMergeableObject, ...opts });
}

/**
 * Deepmerge utility from package {@link https://github.com/TehShrike/deepmerge} with customized `isMergeableObject` function.
 * Base function does not handle Sequelize objects e.g. of type Fn (Sequlize.fn) properly (corrupt them).
 * @param {Arr<Object>} arr - array of objects to be merged
 * @param {Object} opts - merging options
 * @returns {Object} result of merging
 */
deepmerge.all = function all(arr, opts) {
    return basedeepmerge.all(arr, { isMergeableObject, ...opts });
};

module.exports = {
    isMergeableObject,
    deepmerge,
};
