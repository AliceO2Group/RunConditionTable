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
const views = require('../../../app/lib/database/viewsDefinitions');
const expect = require('chai').expect;

module.exports = () => {
    describe('DatabaseSuite', () => {
        describe('should', () => {
            it('build query', async () => {
                const queryBuilder = new QueryBuilder();

                const params = {};
                const result = queryBuilder.build(params);
                expect(result).to.not.be.null;
            });

            it('return SELECT NOW() as a default', async () => {
                const queryBuilder = new QueryBuilder();

                const params = {};
                const result = queryBuilder.build(params);
                expect(result).to.not.be.null;
                expect(result).to.be.equal('SELECT NOW()');
            });

            it('return period view query correctly', async () => {
                const expectedOutcome = `${views.period_view}
                    SELECT name, year, beam, string_agg(energy::varchar, ',') as energy
                    FROM period_view
                    GROUP BY name, year, beam;`
                
                const queryBuilder = new QueryBuilder();

                const params = {page: 'periods'};
                const result = queryBuilder.build(params);
                expect(result).to.not.be.null;
                expect(result).to.not.be.equal(expectedOutcome);
            });
        });
    });
};
