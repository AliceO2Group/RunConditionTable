/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const assert = require('assert');
const Utils = require('../../app/lib/utils');
const ServicesDataCommons = require('../../app/lib/alimonitor-services/ServicesDataCommons.js');

const arrayEquals = (a, b) => Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => {
            if (Array.isArray(val)) {
                return arrayEquals(val, b[index]);
            } else {
                return val === b[index];
            }
        });

module.exports = () => {
    describe('Utils', () => {
        describe('Filtering objects', () => {
            const objectSample = {
                field1: 'value1',
                field2: 'value2',
            };
            const keptFields = {
                field1: 2,
            };

            it('should do nothing when no keptFields provided', () => {
                assert(Utils.filterObject(objectSample) === objectSample);
            });

            it('should filter the values correctly', () => {
                assert(Utils.filterObject(objectSample, keptFields)['2'] === 'value1');
            });

            it('should return an empty object when told to suppress undefined values', () => {
                assert(Object.keys(Utils.filterObject(objectSample, keptFields, true)).length === 0);
            });
        });

        describe('Parsing values to sql', () => {
            const sampleValues1 = [4, 5, 6];
            const sampleValues2 = [4, 5, undefined];
            const sampleValues3 = [4, 5, 'DEFAULT'];

            it('should return the same values when not NaN nor DEFAULT', () => {
                Utils.adjustValuesToSql(sampleValues1).forEach((obj, index) =>
                    assert(obj) == sampleValues1[index]);
            });

            it('should parse undefined values as null', () => {
                assert(Utils.adjustValuesToSql(sampleValues2)[2] === null);
            });

            it('should return wrap DEFAULT in quotes', () => {
                assert(Utils.adjustValuesToSql(sampleValues3)[2] === 'DEFAULT');
            });
        });

        describe('Building insert query', () => {
            const sampleValues = {
                name: 'LHC00',
                beam: 'PbPb',
                energy: 962,
                year: 2000,
            };

            const compareString = `INSERT INTO periods(name, beam, energy, year)
                VALUES('LHC00', 'PbPb', 962, 2000)`;

            it('should create insert query correctly', () => {
                assert(Utils.simpleBuildInsertQuery('periods', sampleValues) === compareString);
            });
        });

        describe('Preserve SQL keywords', () => {
            const expectedRes = ['"end"'];
            const basicCase = ['sth else'];
            it('should wrap END keyword in quotes', () => {
                assert(arrayEquals(Utils.preserveSQLKeywords(['end']), expectedRes));
            });
            it('should not affect other words', () => {
                assert(arrayEquals(Utils.preserveSQLKeywords(basicCase), basicCase));
            });
        });

        describe('Switchcase', () => {
            const defaultVal = 'default';
            const caseNames = ['a', 'b'];
            const cases = {
                a: () => 'a',
                b: () => 'b',
            };
            const defaultCase = () => defaultVal;

            it('should return correct value for each case', () => {
                assert(Utils.switchCase(caseNames[0], cases, defaultCase)() === caseNames[0]);
                assert(Utils.switchCase(caseNames[1], cases, defaultCase)() === caseNames[1]);
            });

            it('should return default value when called with an unknown case', () => {
                assert(Utils.switchCase(caseNames[2], cases, defaultCase)() === defaultVal);
            });
        });

        describe('Delay', () => {
            it('Waits requested number of miliseconds', async () => {
                const delayTime = 100;
                const start = Date.now();
                await Utils.delay(delayTime);
                const end = Date.now();
                assert(start + delayTime <= end);
            });
        });

        describe('Array to chunks', () => {
            it('Should split an array into chunks', async () => {
                const array = [1, 2, 3, 4, 5];
                const chunkSize = 3;
                const expectedOutcome = [[1, 2, 3], [4, 5]];
                const outcome = Utils.arrayToChunks(array, chunkSize);

                assert(arrayEquals(expectedOutcome, outcome));
            });
        });

        describe('Extracting period year', () => {
            it('Should extract period year from period name', () => {
                const periodNameSamples = ['LHC12c', 'LHC23j', 'LHC00q', 'LHC', 'LHC51', null];
                const expectedOutcome = [2012, 2023, 2000, 'NULL', 1951, 'NULL'];
                const outcome = periodNameSamples.map((periodName) => ServicesDataCommons.extractPeriodYear(periodName));
                assert(arrayEquals(expectedOutcome, outcome));
            });
        });
    });
};
