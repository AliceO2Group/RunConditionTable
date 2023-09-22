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
        describe('Transforming filters to sequelize where-cluase ', () => {
            it('should return empty object when provided with undefined or empty object', () => {
                assert.deepStrictEqual(filterToSequelizeWhereClause(undefined), {});
                assert.deepStrictEqual(filterToSequelizeWhereClause({}), {});
            });

            it('should handle syntax for default relational operator \'eq\'', () => {
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
            });

            it('should transform filter object - with pruning', () => {
                const srcFilter = {
                    or: {
                        field1: {
                            gt: '10',
                            lt: '3',
                            _goperator: 'or',
                        },
                        field2: {
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
                        field2: {
                            [Op.like]: 'LHC_%pass',
                            [Op.notLike]: 'LHC_c%',
                        },
                    },
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter));
            });

            it('should transform filter object - without pruning', () => {
                const srcFilter = {
                    field1: {
                        gt: '10',
                        lt: '3',
                        _goperator: 'or',
                    },
                    field2: {
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
                        field2: {
                            [Op.and]: {
                                [Op.like]: 'LHC_%pass',
                                [Op.notLike]: 'LHC_c%',
                            },
                        },
                    },
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter, false));
            });

            it('should transform filter object containing array values - with pruning', () => {
                const srcFilter = {
                    field1: {
                        in: '1,2,4,5      ,1',
                    },
                    field2: {
                        notBetween: '-123,1.1',
                    },
                };

                const expectedFilter = {
                    field1: {
                        [Op.in]: ['1', '2', '4', '5', '1'],
                    },
                    field2: {
                        [Op.notBetween]: ['-123', '1.1'],
                    },
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter));
            });

            it('should transform filter object with array syntax', () => {
                const srcFilter = {
                    or: {
                        $1: {
                            field1: {
                                in: '1,2,4,5      ,1',
                            },
                        },
                        $2: {
                            field2: {
                                notBetween: '-123,1.1',
                            },
                        },
                    },
                };

                const expectedFilter = {
                    [Op.or]: [
                        { field1: {
                            [Op.in]: ['1', '2', '4', '5', '1'],
                        } },

                        { field2: {
                            [Op.notBetween]: ['-123', '1.1'],
                        } },
                    ],
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter));
            });

            it('should throw an error when combining array and object syntax infiltering', () => {
                const srcFilter = {
                    or: {
                        $1: {
                            field1: {
                                in: '1,2,4,5      ,1',
                            },
                        },
                        field2: {
                            notBetween: '-123,1.1',
                        },
                    },
                };

                assert.throws(() => filterToSequelizeWhereClause(srcFilter));
            });

            it('should handle goperator within array syntax', () => {
                const srcFilter = {
                    $1: {
                        field1: 'asdf',
                    },
                    $2: {
                        field1: 'asdf',
                    },
                    _goperator: 'or',
                };

                const expectedFilter = {
                    [Op.or]: [
                        { field1: 'asdf' },
                        { field1: 'asdf' },
                    ],
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter));
            });

            /**
             * @see filterToSequelizeWhereClause#workaroundForSequlizeBug
             */
            it('test workaround for sequelize misbehaviour', () => {
                const srcFilter = {
                    name: {
                        and: { f1: 1 },
                        or: { f2: 2 },
                    },
                };

                const expectedFilter = {
                    name: {
                        [Op.and]: {
                            [Op.and]: { f1: 1 },
                            [Op.or]: { f2: 2 },
                        },
                    },
                };

                assert.deepStrictEqual(expectedFilter, filterToSequelizeWhereClause(srcFilter));
            });
        });
    });
};
