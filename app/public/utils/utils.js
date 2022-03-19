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
export const reduceSerialIf = (initValue, ifTrue, ifFalse, conditions, accFunction) =>
    zip(zip(ifTrue, ifFalse), conditions).reduce(
        (acc, ent) => accFunction(acc, (Boolean(ent[1]) ? ent[0][0] : ent[0][1])),
        initValue)

export function replaceUrlParams(url, entries) {
    const currentParams = Object.fromEntries(url.searchParams.entries());
    for (let [k, v] of entries) {
        currentParams[k] = v;
    }

    const search = '?' + (Object.entries(currentParams).map(([k, v]) => `${k}=${v}`)).join('&');
    return new URL(url.origin + url.pathname + search);
}

export function range(from, to) {
    return Array.from({length: to - from}, (v, k) => k+from);
}

export function url2Str(url) {
    return url.pathname + url.search
}


export function getPathElems(pathname) {
    console.assert(pathname[0] === '/')
    console.assert(pathname.slice(-1) === '/')
    return pathname.slice(1, -1).split('/')
}

export function getPathElem(pathname, i) {
    return getPathElems(pathname)[i];
}

export function urlSearchToParamsObject(search) {
    console.assert(search[0] === '?')
    return Object.fromEntries(
        search.slice(2).split('\&').map((ent) => ent.split('='))
        )
}