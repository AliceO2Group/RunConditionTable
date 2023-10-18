/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const config = require('../../config/configProvider.js');
const views = require('../views');
const procedures = require('../procedures');
const { adjustValuesToSql, switchCase } = require('../../utils');

const { pageNames: PN, filterTypes } = config.public;
const DRP = config.public.dataReqParams;

const pageToViewName = {};
pageToViewName[PN.periods] = 'periods_view';
pageToViewName[PN.runsPerPeriod] = 'runs_per_period_view';
pageToViewName[PN.runsPerDataPass] = 'runs_per_data_pass_view';
pageToViewName[PN.dataPasses] = 'data_passes_view';
pageToViewName[PN.anchoragePerDatapass] = 'anchorage_per_data_pass_view';
pageToViewName[PN.mc] = 'mc_view';
pageToViewName[PN.anchoredPerMC] = 'anchored_per_mc_view';
pageToViewName[PN.flags] = 'flags_view';

const DEFUALT_LIMIT = 50;

/**
 * Class responsible for parsing url params, payloads of client request to sql queries
 */

const handleBetween = (fieldName, pairsList) => {
    if (! Array.isArray(pairsList)) {
        pairsList = [pairsList];
    }
    return pairsList.map((p) => {
        const range = p.split(',');
        if (range.length !== 2) {
            throw 'between clause is incorrectly formatted';
        }
        const [left, right] = adjustValuesToSql(range);
        if (range[0] && range[1]) {
            return `${fieldName} BETWEEN ${left} AND ${right}`;
        } else if (range[0]) {
            return `${fieldName} >= ${left}`;
        } else if (range[1]) {
            return `${fieldName} <= ${right}`;
        }
    }).join(' OR ');
};

const handleLike = (fieldName, values, like) => {
    if (! Array.isArray(values)) {
        values = [values];
    }
    values = values.map((subv) => subv.split(',').map((v) => v.trim()).filter((v) => v)).flat();

    const notS = ! like ? 'NOT' : '';
    if (values.every((v) => isNaN(v))) {
        // Assume that it is for patterns
        const valuesPattern = values.join('|');
        return `${fieldName} ${notS} SIMILAR TO '${valuesPattern}'`;
    } else if (values.every((v) => ! isNaN(v))) {
        // Assumes that it is for numbers with 'in' clause
        const valuesList = values.join(',');
        return `${fieldName} ${notS} IN (${valuesList})`;
    }
};

class PGQueryBuilder {
    static filteringPart(params) {
        // Mapping search params to categorized { key, value } pairs
        const filterTypesRegex = new RegExp(Object.keys(filterTypes).map((t) => `(.*-${t})`).join('|'));
        const filterParams = Object.entries(params)
            .filter(([k]) => k.match(filterTypesRegex))
            .map(([k, v]) => [...k.split('-'), v]);
        const fields2Filters = {};
        filterParams.forEach((l) => {
            fields2Filters[l[0]] = [];
        });
        filterParams.forEach((l) => fields2Filters[l[0]].push(l.slice(1)));

        const cll = Object.entries(fields2Filters).map(([fieldName, clauses]) => Object.fromEntries(clauses.map((cl) => {
            const [filterType, values] = cl;
            const cases = {
                between: () => handleBetween(fieldName, values),
                match: () => handleLike(fieldName, values, true),
                exclude: () => handleLike(fieldName, values, false),
            };
            return [filterType, switchCase(filterType, cases, { default: () => '' })()];
        })));

        const sqlWhereClause = cll.map((cl) => { // For each field
            let mbpart = [cl.match, cl.between].filter((v) => v?.trim()).join(' OR \n');
            mbpart = mbpart ? `(${mbpart})` : '';
            return [mbpart, cl.exclude].filter((c) => c).join(' AND ');
        }).join(' AND \n');

        return sqlWhereClause?.length > 0 ? `WHERE ${sqlWhereClause}` : '';
    }

    static buildSelect(params) {
        const dataSubsetQueryPart = (params) => params[DRP.countRecords] === 'true' ? '' :
            `LIMIT ${params[DRP.itemsPerPage] || DEFUALT_LIMIT} OFFSET ${params[DRP.itemsPerPage] * (params[DRP.pageNumber] - 1) || 0}`;

        const orderingPart = (params) => {
            if (!params['sorting']) {
                return '';
            }
            const { sorting } = params;
            if (sorting.startsWith('-')) {
                const field = sorting.slice(1);
                return `ORDER BY ${field} DESC`;
            } else {
                const field = sorting;
                return `ORDER BY ${field} ASC`;
            }
        };

        const viewName = pageToViewName[params.page];
        const viewGen = views[viewName];

        return `WITH ${viewName} AS (
                    ${viewGen(params)})
                SELECT *
                FROM ${viewName}
                ${PGQueryBuilder.filteringPart(params)}
                ${orderingPart(params)}
                ${dataSubsetQueryPart(params)};`;
    }

    static buildInsertOrUpdate(params) {
        return procedures[params.procedure](params);
    }
}

module.exports = PGQueryBuilder;
