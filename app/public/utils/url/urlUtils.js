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

export function replaceUrlParams(url, params) {
    const currentParams = Object.fromEntries(url.searchParams.entries());
    for (const [k, v] of Object.entries(params)) {
        currentParams[k] = v;
    }

    const search = `?${Object.entries(currentParams).map(([k, v]) => `${k}=${v}`).join('&')}`;
    return new URL(url.origin + url.pathname + search);
}

export function urlSearchToParamsObject(search) {
    if (search[0] !== '?') {
        throw 'incorrect argument';
    }
    return Object.fromEntries(search.slice(2).split('&').map((ent) => ent.split('=')));
}

export const formatParameter = (key, value) => `${key}=${value}`;

/**
 * Prepares the href for the link components
 * @param {Object} parameters list of query parameters, as an object
 * @returns {string} href ready to be used in link components
 */
export const buildHref = (parameters) => {
    const paramEntries = Object.entries(parameters);
    return `?${paramEntries.map(([key, value]) => formatParameter(key, value)).join('&')}`;
};
