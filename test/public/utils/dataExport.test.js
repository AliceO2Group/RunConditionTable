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

const req = require('esm')(module);

const { replacer, prepareCSVContent } = req('../../../app/public/utils/dataExport/export');
const { assert } = require('chai');

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
                assert.deepEqual(
                    Object.keys(sampleObject).reduce((acc, key) => ({ ...acc, [key]: replacer(key, sampleObject[key]) }), {}),
                    expectedResult,
                );
            });
        });

        describe('Check data preparation', () => {
            const rawData = [
                {
                    name: 'LHC23zt',
                    year: 2023,
                    beamType: 'p-p',
                    avgEnergy: 13595,
                    distinctEnergies: [6797.04, 6797.52, 6797.64, 6798],
                },
                {
                    name: 'LHC23zs',
                    year: 2023,
                    beamType: 'p-p',
                    avgEnergy: 13596,
                    distinctEnergies: [6797.4, 6797.52, 6797.64, 6797.76, 6797.88, 6798, 6798.24, 6799.2],
                },
            ];

            const preparedData = 'name,year,beamType,avgEnergy,distinctEnergies\r\n' +
            '"LHC23zt",2023,"p-p",13595,[6797.04,6797.52,6797.64,6798]\r\n' +
            '"LHC23zs",2023,"p-p",13596,[6797.4,6797.52,6797.64,6797.76,6797.88,6798,6798.24,6799.2]';

            it('should prepare CSV data content', () => {
                assert.equal(prepareCSVContent(rawData), preparedData);
            });
        });
    });
};
