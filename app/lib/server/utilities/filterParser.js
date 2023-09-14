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

const { Op } = require('sequelize');
const { throwWrapper } = require('../../utils');

// eslint-disable-next-line max-len
const patternRelationalOperartors = new Set(['like', 'notLike', 'iLike', 'notILike', 'regexp', 'notRegexp', 'iRegexp', 'notIRegexp']);
const unitaryRelationalOperators = new Set(['gt', 'gte', 'lt', 'lte', 'ne']);
const twoElemTupleRelationalConditions = new Set(['between', 'notBetween']);
const arrayRelationalConditions = new Set(['in', 'notIn']);
const complexValuesRelationalConditions = new Set([...twoElemTupleRelationalConditions, ...arrayRelationalConditions]);

const relationalOperators = new Set([
    ...arrayRelationalConditions,
    ...unitaryRelationalOperators,
    ...twoElemTupleRelationalConditions,
    ...patternRelationalOperartors,
]);

const logicalOperators = new Set(['not', 'and', 'or']);

const _groupOperatorName = '_goperator';
const defaultGroupOperator = 'and';

const reservedNames = new Set([...relationalOperators, ...logicalOperators, ...[_groupOperatorName]]);

const transformationSentinel = 'and';

const arrayElementIdentifierRegExp = /^\$((0)|([1-9]+[0-9]*))/;

class TransformHelper {
    constructor(opts) {
        this.opts = opts;
    }

    insertSentinel(filter) {
        return { [transformationSentinel]: filter };
    }

    removeSentinel(filter) {
        return filter[Op[transformationSentinel]];
    }

    handleIntermidiateFilterNode(group, groupOperator) {
        if (typeof group !== 'object') {
            return group;
        }

        const transformedSubfilter = this.transformHelper(group);
        return this.opts.pruneRedundantANDOperator && groupOperator === defaultGroupOperator ?
            transformedSubfilter :
            { [Op[groupOperator]]: transformedSubfilter };
    }

    handleDelimiterSeparatedValues(val, delimiter = ',') {
        return String(val).split(new RegExp(delimiter)).map((v) => v.trim());
    }

    handleArray(relationOperator, group) {
        const groupValues = group.map((val) => this.handleDelimiterSeparatedValues(val)).flat();
        if (patternRelationalOperartors.has(relationOperator)) {
            return [Op[relationOperator.startsWith('not') ? 'and' : 'or'], groupValues.map((v) => ({ [Op[relationOperator]]: v }))];
        } else if (arrayRelationalConditions.has(relationOperator)) {
            return [Op[relationOperator], groupValues];
        } else {
            throw new Error(
                `Array values can be handled only be ${[...patternRelationalOperartors, ...arrayRelationalConditions]} operator`,
            );
        }
    }

    pullGroupOperator(group) {
        const readGroupOperator = group[_groupOperatorName];
        const groupOperator = readGroupOperator ?? defaultGroupOperator;
        delete group[_groupOperatorName];
        return groupOperator;
    }

    transformHelper(filter) {
        const allAreArraysElement = Object.keys(filter).every((k) => arrayElementIdentifierRegExp.test(k)) && Object.entries(filter).length > 0;
        const someAreArraysElement = Object.keys(filter).some((k) => arrayElementIdentifierRegExp.test(k));
        if (someAreArraysElement && !allAreArraysElement) {
            throw new Error('Cannot combine syntax for arrays and object groups');
        }

        const processedFilterEntries = Object.entries(filter)
            .map(([k, group]) => {
                const groupOperator = this.pullGroupOperator(group);
                if (Array.isArray(group)) { // If group is array it is assumed that it is terminal value
                    return this.handleArray(k, group);
                }

                if (!reservedNames.has(k)) { // Assumes that k is field from db view
                    if (typeof group === 'object') {
                        return [k, this.handleIntermidiateFilterNode(group, groupOperator)];
                    } else {
                        return [k, group]; // Assumes that there is not relation operator
                    }
                } else { // Then k stands for operator
                    return [
                        Op[k] ?? throwWrapper(new Error(`No operator <${k}> is allowed, only <${[...reservedNames]}> are allowed`)),
                        complexValuesRelationalConditions.has(k) ?
                            this.handleDelimiterSeparatedValues(group)
                            : this.handleIntermidiateFilterNode(group, groupOperator),
                    ];
                }
            });

        return allAreArraysElement ? processedFilterEntries.map(([_k, group]) => group) : Object.fromEntries(processedFilterEntries);
    }

    transform(filter) {
        if (!filter) {
            return {};
        }
        filter = this.insertSentinel(filter);
        filter = this.transformHelper(filter);
        filter = this.removeSentinel(filter);
        return filter;
    }
}

/**
 * !NOTE for pattern notation used in this description:
 * uppercase written words are non-terminal (as in formal gramatics terminology)
 * and the lowercase one are terminals, e.g. operator 'not' is terminal):
 * dots separate non-terminals (just for clarity),
 * start is Kleen start (as in posix regex)
 * question mark is option quantifier (as in posix regex)
 *
 * Transform filter object from http request.query to sequelize where-clause object
 * Considering the filter object is a tree, each root -> leaf path can be described as:
 *
 *      FILTER_PATH -> .LOGIC_PATH .CONDITION_TAIL
 *
 * where .LOGIC_PATH and .CONDITION_TAIL are
 *
 *      .LOGIC_PATH -> ( .LOGIC_OPERATOR | .ARRAY_ELEM_DESCRIPTOR | (.GROUP_OPERATOR .LOGIC_OPERATOR) )*
 *      .CONDITION_TAIL -> .DB_FIELD_NAME ( (.GROUP_OPERATOR .LOGIC_OPERATOR) | .RELATIONAL_OPERATOR)? .VALUES
 *
 *      where for GROUP_OPERATOR nonterminal allowed terminals are: '_goperator',
 *
 *            for LOGIC_OPERATOR nonterminal allowed terminals are 'and', 'or', 'not',
 *
 *            for ARRAY_ELEM_DESCRIPTOR nonterminal allowed terminals are each which match following string ^\$((0)|([1-9]+[0-9]*))
 *                  ,so dollar ($) character followed by any non-negative integer
 *
 *            for RELATIONAL_OPERATOR nonterminal allowed terminals are
 *                      'gt', 'gte', 'lt', 'lte', 'ne',
 *                      'in', 'notIn', 'between', 'notBetween',
 *                      'like', 'notLike', 'iLike', 'notILike', 'regexp', 'notRegexp', 'iRegexp', 'notIRegexp'
 *
 *            for DB_FIELD_NAME nonterminal allowed terminal is any identifier [_a-z]+[_a-z0-9]* which not overlap with previous ones
 *            for VALUES nonterminal allowed terminal is anything what is meaningful for preceding relational operator
 *
 *
 * As this api is intended for handling http requests in which filtering is defined by url query params,
 * the GROUP_OPERATOR is syntax sugar:
 * Instead of
 *
 *          .../?filter[field1][or][gt]=10&filter[field1][or][lt]=3
 * it can be
 *
 *          .../?filter[field1][gt]=10&filter[field][lt]=3&filter[field1][_fgoperator]=or
 * GROUP_OPERATOR can be ommited, its default value is an 'and'.
 *
 * Example:
 *
 * 1 URL search params are:
 *
 *        .../?filter[or][field1][gt]=10&filter[or][field1][lt]=3&filter[or][field1][_goperator]=or
 *            &filter[or][filed2][like]=LHC_%25pass&filter[or][filed2][notLike]=LHC_c%25
 *            &filter[and][$1][or][f1]=1&filter[and][$1][or][f2]=2&filter[and][$2][or][f3]=3&filter[and][$2][or][f4]=5
 *
 * 2 The url will be parsed by qs in express to:
 *
 *      const query = {
 *      "filter": {
 *        "or": {
 *          "field1": {
 *            "gt": "10",
 *            "lt": "3",
 *            "_goperator": "or"
 *          },
 *          "filed2": {
 *            "like": "LHC_%pass",
 *            "notLike": "LHC_c%"
 *          }
 *        },
 *        "and": {
 *           "$1": {
 *               "or": {
 *                   f1: 1,
 *                   f2: 2,
 *               }
 *           }
 *           "$2": {
 *               "or": {
 *                   f3: 3,
 *                   f4: 4,
 *               }
 *           }
 *        }
 *      }
 *
 * 3 query.filter is being passed as an argument to filterToSequelizeWhereClause function
 * which returns sequelize-compatible where-clause
 *
 *      {
 *         [Symbol(or)]: {
 *           field1: {
 *             [Symbol(or)]: {
 *               [Symbol(gt)]: '10',
 *               [Symbol(lt)]: '3'
 *             }
 *           },
 *           filed2: {
 *             [Symbol(and)]: {
 *               [Symbol(like)]: 'LHC_%pass',
 *               [Symbol(notLike)]: 'LHC_c%'
 *             }
 *           }
 *         },
 *
 *         [Symbol(and)]: [      !!! Note that here is square bracket
 *            [Symbol(or)]: {
 *               f1: 1,
 *               f2: 2,
 *            },
 *            [Symbol(or)]: {
 *               f3: 3,
 *               f4: 4,
 *            }
 *         ]
 *      }
 *
 * What is equivalent to sql:
 *
 *      WHERE ((field1 > 10 OR field1 < 3) OR (field2 like 'LHC_%pass' AND field2 NOT LIKE 'LHC_c%'))
 *        AND ( ( f1 = 1 OR f2 = 2 ) AND ( f3 = 3 OR f4 = 4 ) )
 *
 * @param {Object} filter - from req.query
 * @param {boolean} pruneRedundantANDOperator - if true (default) remove unnecessaary 'and' operators
 * @returns {Object} sequelize where object
 */
const filterToSequelizeWhereClause = (filter, pruneRedundantANDOperator = true) =>
    new TransformHelper({ pruneRedundantANDOperator }).transform(filter);

module.exports = {
    filterToSequelizeWhereClause,
};
