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
const logicOperators = new Set(['not', 'and', 'or']);

const _groupOperatorName = '_goperator';
const defaultGroupOperator = 'and';

const reservedNames = new Set([...relationalOperators, ...logicOperators, ...[_groupOperatorName]]);

const transformFilterTail = (fieldGroup) => Object.fromEntries(
    Object.entries(fieldGroup).map(([k, v]) => [
        Op[k] ?? throwWrapper(new Error(`No relational operator like <${k}>, only <${[...relationalOperators]}>`)),
        v,
    ]),
); // TODO handle arrays

/**
 * Transform filter object from http request.query to sequelize where object
 * Assuming that the filter object can be considered as tree, then each root -> leaf,
 * 1. path can be described using one of two patterns
 * (dots separate nodes, words written uppercase are non-terminal, (as in formal gramatics terminology)
 * and that written lowercase are terminal, e.g. operator not is termianl):
 *
 *   (.LOGIC_OPERATR)*.DB_FIELD_NAME.(RELATION_OPERATOR.VALUE | GROUP_OPERATOR.(LOGIC_OPERATOR)) | or
 *   (.LOGIC_OPERATR)*.GROUP_OPERATOR.(LOGIC_OPERATOR)
 *
 *      where GROUP_OPERATOR can be only _fgoperator which is actual name placed in url,
 * so each top-down path begins with sequence of logical operator and ends with
 *         DB_FIELD_NAME._fgoperator.(and|or|not)
 * or with DB_FIELD_NAME.RELATIONAL_OPERATOR.VALUE
 * or with ._fgoperator.(and|or|not)
 *
 * 2. Path can be described using regex as:
 *   (\.((and)|(or)|(not)))*\.([_a-z][_a-z0-9]*)\.(((and)|(or)|(not))\..*)|(_fgoperator\.((or)|(and)|(not))))                |
 *   -----------------------  ------------------   -----------------------|--------------------------------                  | or
 *       (.LOGIC_OPERATR)*      .DB_FIELD_NAME     RELATION_OPERATOR.VALUE   GROUP_OPERATOR.LOGIC_OPERATOR                   |
 *
 *   (\.((and)|(or)|(not)))*\._fgoperator\.((or)|(and)|(not))
 *   -----------------------  --------------------------------
 *       (.LOGIC_OPERATR)*     .GROUP_OPERATOR.LOGIC_OPERATOR
 *
 *
 * 3. As this api is intened for handling http requests in which filtering is defined in url query params,
 * the GROUP_OPERATOR is syntax sugar for writtening requests in other way:
 * Instead of /?filter[field1][or][gt]=10&filter[field1][or][lt]=3
 * it can be
 *            /?filter[field1][gt]=10&filter[field][lt]=3&filter[field1][_fgoperator]=or
 * GROUP_OPERATOR can be ommited, by default it is and.
 *
 * Example:
 * 1` URL: .../?filter[or][field1][gt]=10&filter[or][field1][lt]=3&filter[or][field1][_gfoperator]=or ...
 *                            ... &filter[or][filed2][like]=LHC_%pass&filter[or][filed2][notLike]=LHC_c%
 * 2` will be parsed by qs in exporess to
 *  {or: {
 *
 * }
 * }
 *
 * @param {Object} filter - from req.query
 * @returns {Object} sequelize where object
 */

const a = {
    filed1: {
        or: {
            ft: 10,
            lt: 3,
        },
    },
};

const transforFilter = (filter, includeImpliciteLogicOperator) => Object.fromEntries(
    Object.entries(filter)
        .map(([k, v]) => {
            const readGroupOperator = v[_groupOperatorName];
            const groupOperator = readGroupOperator ?? defaultGroupOperator;
            delete v[_groupOperatorName];

            if (!reservedNames.has(k)) { // Assumes that k is field from db view
                const fieldGroup = transformFilterTail(v, includeImpliciteLogicOperator);
                return [k, { [Op[groupOperator]]: fieldGroup }];
            } else { // Then k stands for logical operator
                return includeImpliciteLogicOperator || groupOperator != defaultGroupOperator ?
                    [Op[k], { [Op[groupOperator]]: transforFilter(v) }] :
                    [Op[k], transforFilter(v)];
            }
        }),
);

const filterToSequelizeWhereClause = (filter, includeImpliciteLogicOperator = false) =>
    transforFilter({ and: filter }, includeImpliciteLogicOperator);

module.exports = {
    filterToSequelizeWhereClause,
};
