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

const QueryBuilder = require('../../../app/lib/database/QueryBuilder');
const views = require('../../../app/lib/database/views');
const expect = require('chai').expect;

module.exports = () => {
    describe('DatabaseSuite', () => {
        describe('should', () => {
            it('build query', async () => {
                const params = {page: 'periods'};
                const result = QueryBuilder.buildSelect(params);
                expect(result).to.not.be.null;
            });

            it('return period view query correctly', async () => {
                const expectedOutcome = `WITH periods_view AS (${views.periods_view()})
                    SELECT *
                    FROM periods_view`

                const params = {page: 'periods'};
                const result = QueryBuilder.buildSelect(params);
                expect(result).to.not.be.null;
                expect(result).to.not.be.equal(expectedOutcome);
            });
        });
    });
};
