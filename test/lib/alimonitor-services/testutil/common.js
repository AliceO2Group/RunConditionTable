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

/**
 * Generate random data with structure defined in given argument
 * @param {*} unitDefinition - definition of data to be generated
 * @return {*} data
 * UnitGenerator can be any strcture, primitive value, function or their composition
 * How does the function work can be described via produtions:
 * if unitDefinition is ... then the function (abbr. here to U) returns ...:
 *  U: PRIMITIVE_VALUE -> PRIMITIVE_VALUE
 *  U: FUNCTION -> FUNCTION()
 *  U: ARRAY<SUB_UNIT_DEFINITION> -> ARRAY<U(SUB_UNIT_DEFINITION)>
 *  U: OBJECT<K, V> -> OBJECT<U(K),U(V)>
 *
 * In particular, in last case key of some unitDefinition being object
 * can be a function generating some random key, but not being given explicitly, rather as wrapped one with class 'Symbol',
 * so if you want to have data (objects) with random keys you can provide unitDefinition like
 * {[Symbol(() => SOME_RANDOM_KEY)]: () => SOME_RANDOM_VALUE, ...}
 */
const universalNoncontextualDataUnitGenerator = (unitDefinition) => {
    if (typeof unitDefinition === 'function') {
        return unitDefinition();
    } else if (typeof unitDefinition === 'object') {
        return Array.isArray(unitDefinition) ?
            unitDefinition.map((subUnitDefinition) => universalNoncontextualDataUnitGenerator(subUnitDefinition))
            : Object.fromEntries([
                ...Object.entries(unitDefinition).map(([keyName, subUnitGenerator]) =>
                    [keyName, universalNoncontextualDataUnitGenerator(subUnitGenerator)]),
                ...Object.getOwnPropertySymbols(unitDefinition)
                    .map((symbol) => [
                        universalNoncontextualDataUnitGenerator(eval(symbol.description)),
                        universalNoncontextualDataUnitGenerator(unitDefinition[symbol]),
                    ]),
            ]);
    } else {
        // Assume some primitive type
        return unitDefinition;
    }
};

/**
 * Generate array with given size, which elements are generated according to given unitDefinition
 * @param {Number} size - returning array size
 * @param {*} unitDefinition - @see universalNoncontextualDataUnitGenerator
 * @return {Array<*>} array of genereated data
 */
const universalNoncontextualArrayDataGenerator = (size, unitDefinition) =>
    [...new Array(size)].map(() => universalNoncontextualDataUnitGenerator(unitDefinition));

module.exports = {
    randint,
    choice,
    universalNoncontextualDataUnitGenerator,
    universalNoncontextualArrayDataGenerator,
};
