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
const unitaryRelationalOperators = new Set(['gt', 'gte', 'lt', 'lte', 'ne', 'like', 'notLike', 'iLike', 'notILike', 'regexp', 'notRegexp', 'iRegexp', 'notIRegexp']);
const arrayRelationalConditions = new Set(['between', 'notBetween', 'in', 'notIn']);
const relationalOperators = new Set([...arrayRelationalConditions, ...unitaryRelationalOperators]);
const logicalOperators = new Set(['not', 'and', 'or']);

const _groupOperatorName = '_goperator';
const defaultGroupOperator = 'and';

const reservedNames = new Set([...relationalOperators, ...logicalOperators, ...[_groupOperatorName]]);

const transformationSentinel = 'and';

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
        const transformedSubfilter = this.transformHelper(group);
        return this.opts.pruneRedundantANDOperator && groupOperator === defaultGroupOperator ?
            transformedSubfilter :
            { [Op[groupOperator]]: transformedSubfilter };
    }

    handleArrayValues(val) {
        return val.split(/,/).map((v) => v.trim());
    }

    handelFieldFilterTail(fieldGroup, groupOperator) {
        const transformedFieldGroup = Object.fromEntries(Object.entries(fieldGroup)
            .map(([relOp, val]) => [
                Op[relOp] ?? throwWrapper(new Error(`No relational operator <${relOp}>, only <${[...relationalOperators]}> are allowed`)),
                arrayRelationalConditions.has(relOp) ? this.handleArrayValues(val) : val,
            ]));
        return this.opts.pruneRedundantANDOperator && groupOperator === defaultGroupOperator ?
            transformedFieldGroup :
            { [Op[groupOperator]]: transformedFieldGroup };
    }

    pullGroupOperator(group) {
        const readGroupOperator = group[_groupOperatorName];
        const groupOperator = readGroupOperator ?? defaultGroupOperator;
        delete group[_groupOperatorName];
        return groupOperator;
    }

    transformHelper(filter) {
        return Object.fromEntries(Object.entries(filter)
            .map(([k, group]) => {
                const groupOperator = this.pullGroupOperator(group);
                if (!reservedNames.has(k)) { // Assumes that k is field from db view
                    if (typeof group === 'object') {
                        return [k, this.handelFieldFilterTail(group, groupOperator)];
                    } else {
                        return [k, group]; // Assumes that there is not relation operator
                    }
                } else { // Then k stands for logical operator
                    return [
                        Op[k] ?? throwWrapper(new Error(`No logical operator <${k}>, only <${[...logicalOperators]}> are allowed`)),
                        this.handleIntermidiateFilterNode(group, groupOperator),
                    ];
                }
            }));
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
 * Transform filter object from http request.query to sequelize where-clause object
 * Considering the filter object is a tree, each root -> leaf path can be described as:
 * 1. one of the two patterns
 * (dots separate nodes, uppercase written words are non-terminal (as in formal gramatics terminology)
 * and that lowercase are terminal, e.g. operator 'not' is terminal):
 *
 *   (.LOGIC_OPERATR)*.DB_FIELD_NAME.(RELATION_OPERATOR.VALUE | GROUP_OPERATOR.(LOGIC_OPERATOR)) | or
 *   (.LOGIC_OPERATR)*.GROUP_OPERATOR.(LOGIC_OPERATOR)
 *
 *      where '_goperator' is the only GROUP_OPERATOR terminal,
 *
 * So each top-down path begins with sequence of logical operators and ends with
 *         DB_FIELD_NAME._fgoperator.(and|or|not)
 * or with DB_FIELD_NAME.RELATIONAL_OPERATOR.VALUE
 * or with ._fgoperator.(and|or|not)
 *
 * 2. one of the two corresnponding regexes:
 *   (\.((and)|(or)|(not)))*\.([_a-z][_a-z0-9]*)\.(((and)|(or)|(not))\..*)|(_fgoperator\.((or)|(and)|(not))))                |
 *   -----------------------  ------------------   -----------------------|--------------------------------                  | or
 *       (.LOGIC_OPERATR)*      .DB_FIELD_NAME     RELATION_OPERATOR.VALUE   GROUP_OPERATOR.LOGIC_OPERATOR                   |
 *
 *   (\.((and)|(or)|(not)))*\._fgoperator\.((or)|(and)|(not))
 *   -----------------------  --------------------------------
 *       (.LOGIC_OPERATR)*     .GROUP_OPERATOR.LOGIC_OPERATOR
 *
 *
 * 3. As this api is intended for handling http requests in which filtering is defined by url query params,
 * the GROUP_OPERATOR is syntax sugar:
 * Instead of /?filter[field1][or][gt]=10&filter[field1][or][lt]=3
 * it can be
 *            /?filter[field1][gt]=10&filter[field][lt]=3&filter[field1][_fgoperator]=or
 * GROUP_OPERATOR can be ommited, its default value is an 'and'.
 *
 * Example:
 * 1` URL is: .../?filter[or][field1][gt]=10&filter[or][field1][lt]=3&filter[or][field1][_goperator]=or ...
 *              ... &filter[or][filed2][like]=LHC_%pass&filter[or][filed2][notLike]=LHC_c%
 * 2` The url will be parsed by qs in express to:
 * const query = {
 * "filter": {
 *   "or": {
 *     "field1": {
 *       "gt": "10",
 *       "lt": "3",
 *       "_goperator": "or"
 *     },
 *     "filed2": {
 *       "like": "LHC_%pass",
 *       "notLike": "LHC_c%"
 *     }
 *   }
 * }
 *
 * 3` query.filter is being passed as an argument to filterToSequelizeWhereClause function
 * which returns sequelize-compatible where-clause
 *
 * {
 *  [Symbol(or)]: {
 *    field1: {
 *      [Symbol(or)]: {
 *        [Symbol(gt)]: '10',
 *        [Symbol(lt)]: '3'
 *      }
 *    },
 *    filed2: {
 *      [Symbol(and)]: {
 *        [Symbol(like)]: 'LHC_%pass',
 *        [Symbol(notLike)]: 'LHC_c%'
 *      }
 *    }
 *  }
 * }
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
