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
const { expect } = require('chai');
const Utils = require('../../../app/lib/utils');
const { ServicesDataCommons } = require('../../../app/lib/alimonitor-services/helpers');

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
                assert.deepStrictEqual(Utils.filterObject(objectSample), objectSample);
            });

            it('should filter the values correctly', () => {
                assert.deepStrictEqual(Utils.filterObject(objectSample, keptFields)['2'], 'value1');
            });

            it('should return an empty object when told to suppress undefined values', () => {
                expect(Object.keys(Utils.filterObject(objectSample, { noField: 'null' }, true))).to.lengthOf(0);
            });
        });

        describe('Parsing values to sql', () => {
            const sampleValues1 = [4, 5, 6];

            it('should return the same values when not NaN nor DEFAULT', () => {
                assert.deepStrictEqual(Utils.adjustValuesToSql(sampleValues1), sampleValues1);
            });

            it('should parse undefined values as null', () => {
                assert.equal(Utils.adjustValuesToSql(undefined), 'null');
            });

            it('should return unquoted DEFAULT', () => {
                assert.equal(Utils.adjustValuesToSql('DEFAULT'), 'DEFAULT');
            });
        });

        describe('Preserve SQL keywords', () => {
            const expectedRes = ['"end"'];
            const basicCase = ['sth else'];
            it('should wrap END keyword in quotes', () => {
                assert.deepStrictEqual(Utils.preserveSQLKeywords(['end']), expectedRes);
            });
            it('should not affect other words', () => {
                assert.deepStrictEqual(Utils.preserveSQLKeywords(basicCase), basicCase);
            });
        });

        describe('Switchcase', () => {
            const defaultVal = 'default';
            const caseNames = ['a', 'b'];
            const cases = {
                a: () => 'a',
                b: () => 'b',
            };
            const opts = { default: () => defaultVal };

            it('should return correct value for each case', () => {
                assert.equal(Utils.switchCase(caseNames[0], cases, opts)(), caseNames[0]);
                assert.equal(Utils.switchCase(caseNames[1], cases, opts)(), caseNames[1]);
            });

            it('should return default value when called with an unknown case', () => {
                assert.equal(Utils.switchCase(caseNames[2], cases, opts)(), defaultVal);
            });
        });

        describe('Array to chunks', () => {
            it('Should split an array into chunks', async () => {
                const array = [1, 2, 3, 4, 5];
                const chunkSize = 3;
                const expectedOutcome = [[1, 2, 3], [4, 5]];
                const outcome = Utils.arrayToChunks(array, chunkSize);

                assert.deepStrictEqual(expectedOutcome, outcome);
            });
        });

        describe('Extracting period year', () => {
            it('Should extract period year from period name', () => {
                const periodNameSamples = ['LHC12c', 'LHC23j', 'LHC00q', 'LHC', 'LHC51', null];
                const expectedOutcome = [2012, 2023, 2000, 'NULL', 1951, 'NULL'];
                const outcome = periodNameSamples.map((periodName) => ServicesDataCommons.extractPeriodYear(periodName));
                assert.deepStrictEqual(expectedOutcome, outcome);
            });
        });
    });
};
