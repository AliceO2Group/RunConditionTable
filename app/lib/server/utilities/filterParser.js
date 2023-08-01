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
const unitarComparisonOperators = new Set(['gt', 'gte', 'lt', 'lte', 'ne', 'like', 'notLike', 'iLike', 'notILike', 'regexp', 'notRegexp', 'iRegexp', 'notIRegexp']);
const arrayComparisonConditions = new Set(['between', 'notBetween', 'in', 'notIn']);
const comparisonOperators = new Set([...arrayComparisonConditions, ...unitarComparisonOperators]);
const logicOperators = new Set(['not', 'and', 'or']);

const _fieldGroupOperatorName = '_fgoperator';
const specialKeys = new Set([_fieldGroupOperatorName]);
const allowdFieldGroupOperators = new Set(['and', 'or']);
const defaultFieldGroupLogicOperator = 'and';

const reservedNames = new Set([...comparisonOperators, ...logicOperators, ...specialKeys]);

const transformFilterTail = (fieldGroup) => Object.fromEntries(
    Object.entries(fieldGroup).map(([k, v]) => [
        Op[k] ?? throwWrapper(new Error(`No comparison operator like <${k}>, only <${[...comparisonOperators]}>`)),
        v,
    ]),
); // TODO handle arrays

/**
 * Ttransform filter object from http request.query to sequelize where object
 * @param {Object} filter - from req.query
 * @returns {Object} sequelize where object
 */
const filterToSequelizeWhereClause = (filter) => Object.fromEntries(
    Object.entries(filter)
        .map(([k, v]) => {
            if (!reservedNames.has(k)) { // Assumes that k is field from db view
                const readFGOperator = v[_fieldGroupOperatorName];
                const fieldGroupOperator = !readFGOperator ?
                    defaultFieldGroupLogicOperator :
                    allowdFieldGroupOperators.has(readFGOperator) ?
                        readFGOperator :
                        throwWrapper(new Error(`No group field operator like <${readFGOperator}>, only <${[...allowdFieldGroupOperators]}>`));

                delete v[_fieldGroupOperatorName];
                const fieldGroup = transformFilterTail(v);
                return [k, { [Op[fieldGroupOperator] ?? 1]: fieldGroup }];
            } else { // Then k stands for logical operator
                return [Op[k], filterToSequelizeWhereClause(v)];
            }
        }),
);

module.exports = {
    filterToSequelizeWhereClause,
};
