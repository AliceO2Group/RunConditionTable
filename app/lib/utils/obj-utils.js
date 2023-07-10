/**
 *
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

const util = require('util');

const execp = util.promisify(require('child_process').exec);

async function exec(cmd) {
    if (Array.isArray(cmd)) {
        cmd = cmd.join(' ');
    }
    return await execp(cmd);
}

function reversePrimitiveObject(obj) {
    return Object.fromEntries(Object.entries(obj).map((e) => e.reverse()));
}

function filterObject(obj, keptFields, suppressUndefined = false) {
    if (!keptFields) {
        return obj;
    }
    const res = {};
    for (const [nr, nl] of Object.entries(keptFields)) {
        if (!suppressUndefined || res[nl]) {
            res[nl] = obj[nr];
        }
    }
    return res;
}

function switchCase(caseName, cases, defaultCaseValue) {
    return Object.prototype.hasOwnProperty.call(cases, caseName)
        ? cases[caseName]
        // eslint-disable-next-line brace-style
        : defaultCaseValue ? defaultCaseValue : () => {throw new Error('no case, no default case'); };
}

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function replaceAll(s, pattern, replace) {
    const p = s.split(pattern);
    return p.join(replace);
}

function arrayToChunks(arr, chunkSize) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
}

function applyOptsToObj(obj, options) {
    Object.entries(options).forEach(([k, v]) => {
        obj[k] = v;
    });
}

function nullIfThrows(func, args, errorHandler) {
    try {
        return func(...args);
    } catch (e) {
        if (errorHandler) {
            errorHandler(e, args);
        }
        return null;
    }
}

function distinct(arr) {
    return arr.filter((value, index, self) => self.indexOf(value) === index);
}

function throwNotImplemented() {
    throw new Error('Not implemented');
}

function throwAbstract() {
    throw new Error('Abstract, can not be used');
}

module.exports = {
    exec,
    reversePrimitiveObject,
    filterObject,
    switchCase,
    delay,
    replaceAll,
    arrayToChunks,
    applyOptsToObj,
    nullIfThrows,
    distinct,
    throwNotImplemented,
    throwAbstract,
};
