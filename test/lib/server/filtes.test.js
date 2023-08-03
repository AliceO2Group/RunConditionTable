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
const { Op } = require('sequelize');
const { filterToSequelizeWhereClause } = require('../../../app/lib/server/utilities');

module.exports = () => {
    describe('Server utils', () => {
        describe('Transforming filtes to sequelize where-cluase ', () => {
            it('empty filter', () => {
                assert.deepStrictEqual(filterToSequelizeWhereClause(undefined), {});
                assert.deepStrictEqual(filterToSequelizeWhereClause({}), {});
            }),

            it('not existing operator', () => {
                const srcFilter = {
                    not: {
                        nand: {
                            field3: { eq: 1 },
                        },
                    },
                };

                assert.throws(() => filterToSequelizeWhereClause(srcFilter));
            }),

            it('default relational operator', () => {
                const srcFilter = {
                    not: {
                        field3: 1,
                    },
                };

                const expectedFilter = {
                    [Op.not]: {
                        field3: 1,
                    },
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter));
            }),

            it('correct transformation - with pruning', () => {
                const srcFilter = {
                    or: {
                        field1: {
                            gt: '10',
                            lt: '3',
                            _goperator: 'or',
                        },
                        filed2: {
                            like: 'LHC_%pass',
                            notLike: 'LHC_c%',
                        },
                    },
                };

                const expectedFilter = {
                    [Op.or]: {
                        field1: {
                            [Op.or]: {
                                [Op.gt]: '10',
                                [Op.lt]: '3',
                            },
                        },
                        filed2: {
                            [Op.like]: 'LHC_%pass',
                            [Op.notLike]: 'LHC_c%',
                        },
                    },
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter));
            });

            it('correct transformation - without pruning', () => {
                const srcFilter = {
                    field1: {
                        gt: '10',
                        lt: '3',
                        _goperator: 'or',
                    },
                    filed2: {
                        like: 'LHC_%pass',
                        notLike: 'LHC_c%',
                    },
                };

                const expectedFilter = {
                    [Op.and]: {
                        field1: {
                            [Op.or]: {
                                [Op.gt]: '10',
                                [Op.lt]: '3',
                            },
                        },
                        filed2: {
                            [Op.and]: {
                                [Op.like]: 'LHC_%pass',
                                [Op.notLike]: 'LHC_c%',
                            },
                        },
                    },
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter, false));
            });

            it('correct transformation - with array values, with pruning', () => {
                const srcFilter = {
                    field1: {
                        in: '1,2,4,5      ,1',
                    },
                    filed2: {
                        notBetween: '-123,1.1',
                    },
                };

                const expectedFilter = {
                    field1: {
                        [Op.in]: ['1', '2', '4', '5', '1'],
                    },
                    filed2: {
                        [Op.notBetween]: ['-123', '1.1'],
                    },
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter));
            });
        });
    });
};
