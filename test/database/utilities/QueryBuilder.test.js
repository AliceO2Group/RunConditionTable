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