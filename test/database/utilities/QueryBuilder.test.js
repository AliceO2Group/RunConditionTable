const QueryBuilder = require('../../../app/lib/database/QueryBuilder');
const expect = require('chai').expect;

module.exports = () => {
    describe('DatabaseSuite', () => {
        describe('should', () => {
            it('build query', async () => {
                const queryBuilder = new QueryBuilder();

                const mockData = [];
                const result = queryBuilder.build(mockData);
                expect(result).to.not.be.null;
                // expect(result.id).to.equal(2);
            });
        });
    });
};