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
const { databaseManager: { repositories } } = require('../../app/lib/database/DatabaseManager.js');
const assert = require('assert');

module.exports = () => {
    describe('RepositoriesSuite', () => {
        describe('testing if transaction methods give the same result as non-transactional ones', () => {
            const testableMethodNames = new Set(['count', 'findAll', 'findOne']);
            Object.values(repositories).map((repo) =>
                describe(`${repo.model.name}Repository`, () => Object.getOwnPropertyNames(repo.T)
                    .filter((n) => testableMethodNames.has(n))
                    .map((methodName) => {
                        it(`should acquire the same result from transaction and non-transactional method #${methodName}`, async () => {
                            const nonTransactionResult = await repo[methodName]();
                            const transationResult = await repo.T[methodName]();
                            assert.deepStrictEqual(nonTransactionResult, transationResult);
                        });
                    })));
        });
    });
};
