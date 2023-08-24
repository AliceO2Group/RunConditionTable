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

const req = require('esm')(module)
const { replacer } = req('../../../app/public/utils/dataExport/export');
const assert = require('assert');

module.exports = () => {
    describe('CSV Export', () => {

        describe('Replacer', () => {
            const sampleObject = {
                a: 1,
                b: 2,
                c: 'aa',
                d: null,
                e: 'bb',
                f: 123,
            };
            const expectedResult = {
                a: 1,
                b: 2,
                c: 'aa',
                d: '',
                e: 'bb',
                f: 123,
            };

            it('should replace null values with empty string', () => {
                assert.deepEqual(Object.keys(sampleObject).reduce((acc, key) => ({...acc, [key]: replacer(key, sampleObject[key])}), {}), expectedResult);
            });
        });

        /*
        describe('Check data preparation', () => {
            it('should not return null', () => {
                assert(preparedData(dataSample) !== null);
            });

            it('should filter values properly', () => {
                assert(preparedData(dataSample).indexOf('b field') === -1);
                assert(preparedData(dataSample).indexOf(3) === -1);
            });
        });
        */
    });
};
