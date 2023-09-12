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

const randint = (min = 0, max = 0) => Math.round(Math.random() * (max - min) + min);
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const universalNoncontextualDataUnitGenerator = (unitGenerator) => {
    if (typeof unitGenerator === 'function') {
        return unitGenerator();
    } else if (typeof unitGenerator === 'object') {
        return Array.isArray(unitGenerator) ?
            unitGenerator.map((subUnitGenerator) => universalNoncontextualDataUnitGenerator(subUnitGenerator))
            : Object.fromEntries([
                ...Object.entries(unitGenerator).map(([keyName, subUnitGenerator]) =>
                    [keyName, universalNoncontextualDataUnitGenerator(subUnitGenerator)]),
                ...Object.getOwnPropertySymbols(unitGenerator)
                    .map((symbol) => [
                        eval(symbol.description)(),
                        universalNoncontextualDataUnitGenerator(unitGenerator[symbol]),
                    ]),
            ]);
    } else {
        // Assume some primitive type
        return unitGenerator;
    }
};

const universalNoncontextualArrayDataGenerator = (size, unitGenerator) =>
    [...new Array(size)].map(() => universalNoncontextualDataUnitGenerator(unitGenerator));

module.exports = {
    randint,
    choice,
    universalNoncontextualDataUnitGenerator,
    universalNoncontextualArrayDataGenerator,
};
