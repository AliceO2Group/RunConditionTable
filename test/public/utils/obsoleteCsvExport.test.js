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
const { preparedData } = req('../../../app/public/utils/obsoleteCsvExport');
const { preparedFile } = req('../../../app/public/utils/obsoleteCsvExport');
const assert = require('assert');

module.exports = () => {
    describe('CSV Export (Obsolete)', () => {
        const dataSample = {
            payload: {
                rows: [
                    {
                        marked: true,
                        energy: 2,
                    },
                    {
                        marked: false,
                        energy: 3,
                    }
                ],
                fields: [
                    {
                        name: "energy",
                        marked: true,
                    },
                    {   name: "b field",
                        marked: false,
                    }
                ]
            }
        }

        describe('Check data preparation', () => {
            it('should not return null', () => {
                assert(preparedData(dataSample) !== null);
            });

            it('should filter values properly', () => {
                assert(preparedData(dataSample).indexOf('b field') === -1);
                assert(preparedData(dataSample).indexOf(3) === -1);
            });
        });

        describe('Check data export', () => {
            var fetchedData = {'periods': []};
                fetchedData['periods']['LHC17k'] = dataSample;

            const modelSample = {
                getCurrentDataPointer: () => {
                    return {
                        page: 'periods',
                        index: 'LHC17k',
                    }
                },
                fetchedData: fetchedData
            }
            
            it('should not throw errors', () => {
                assert.doesNotThrow(() => preparedFile(modelSample));
            });

            it('should return csv file', () => {
                var fetchedData = {'periods': []};
                fetchedData['periods']['LHC17k'] = dataSample;
                assert(() => preparedFile(modelSample).uri.slice(0, 27) === 'data:text/csv;charset=utf-8,');
            });

            it('should be named like the current view', () => {
                var fetchedData = {'periods': []};
                fetchedData['periods']['LHC17k'] = dataSample;
                assert(() => preparedFile(modelSample).name === 'periods-LHC17k');
            });           
        });
    });
};
