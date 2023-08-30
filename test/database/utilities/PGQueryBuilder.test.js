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

const PGQueryBuilder = require('../../../app/lib/database/utilities/PGQueryBuilder');
const views = require('../../../app/lib/database/views');
const { databaseService } = require('../../../app/lib/database/DatabaseService');
const { expect } = require('chai');
const assert = require('assert');

module.exports = () => {
    describe('DatabaseSuite', () => {
        describe('should', () => {
            it('build query', async () => {
                const params = {page: 'periods'};
                const result = PGQueryBuilder.buildSelect(params);
                expect(result).to.not.be.null;
            });

            it('return period view query correctly', async () => {
                const expectedOutcome = `WITH periods_view AS (${views.periods_view()})
                    SELECT *
                    FROM periods_view`

                const params = {page: 'periods'};
                const result = PGQueryBuilder.buildSelect(params);
                expect(result).to.not.be.null;
                expect(result).to.not.be.equal(expectedOutcome);
            });

            it('check query syntax for filtering params for periods view - 1', async () => {

                const filteringParams = {
                    page: 'periods',
                    'items-per-page': '50',
                    'page-number': '1',
                    sorting: '-name',
                    'name-match': ['%c%,%a', '%C%C'],
                    'beam-match': 'p-p',
                };

                await assert.doesNotReject( async () => {
                    const q = PGQueryBuilder.buildSelect(filteringParams);
                    await databaseService.pgExec(q);
                });
                
            });

            it('check query syntax for filtering params for periods view - 2', async () => {

                const filteringParams = {
                    page: 'periods',
                    'items-per-page': '2',
                    'page-number': '2',
                    sorting: '-name',
                    'name-match': '%c%',
                    'beam-match': 'p-p,Pb-Pb',
                    'year-exclude': ['2024', '2025,1999'],
                    'year-between': ['2022,', '2222,2555', ',2055']
                };

                await assert.doesNotReject( async () => {
                    const q = PGQueryBuilder.buildSelect(filteringParams);
                    await databaseService.pgExec(q);
                });
            });


            it('check query syntax for filtering params for periods view - 3 (strangely formatted params)', async () => {

                const filteringParams = {
                    page: 'periods',
                    'items-per-page': '2',
                    'page-number': '2',
                    sorting: '-name',
                    'name-match': '%c%',
                    'name-exclude': ['%cccASDF%,', '%asdf,,,%asdf'],
                    'beam-match': 'p-p,Pb-Pb',
                    'year-exclude': ['2024', '2025'],
                    'year-between': ['2022,', ',2555']

                };

                await assert.doesNotReject( async () => {
                    const q = PGQueryBuilder.buildSelect(filteringParams);
                    await databaseService.pgExec(q);
                });
            });

            it('check INCORRECT between clause in filtering params for periods view - 4', async () => {

                const filteringParams = {
                    page: 'periods',
                    'items-per-page': '2',
                    'page-number': '2',
                    sorting: '-name',
                    'year-between': [',,2022,'],
                };

                assert.throws(() => {
                    const q = PGQueryBuilder.buildSelect(filteringParams);
                });
            });



        });
    });
};
