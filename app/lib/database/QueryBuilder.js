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

const config = require('../config/configProvider.js');
const views = require("./views") 
const { pagesNames } = config.public;
const DRP = config.public.dataReqParams;

const pageToViewName = {};
pageToViewName[pagesNames.periods] = 'periods_view'
pageToViewName[pagesNames.runsPerPeriod] = 'runs_per_period_view'
pageToViewName[pagesNames.runsPerDataPass] = 'runs_per_data_pass_view'
pageToViewName[pagesNames.dataPasses] = 'data_passes_view'
pageToViewName[pagesNames.anchoragePerDatapass] = 'anchorage_per_data_pass_view'
pageToViewName[pagesNames.mc] = 'mc_view'
pageToViewName[pagesNames.anchoredPerMC] = 'anchored_per_mc_view'
pageToViewName[pagesNames.flags] = 'flags_view'
/**
 * Class responsible for parsing url params, payloads of client request to sql queries
 */
class QueryBuilder {

    static filteringPart(params) {
        const filterTypes = ['match', 'exclude', 'from', 'to'];
        const filtersTypesToParams = {
            match: [],
            exclude: [],
            from: [],
            to: []
        }
        const filtersTypesToSqlOperand = {
            match: 'LIKE',
            exclude: 'NOT LIKE',
            from: '>=',
            to: '<='
        }
        const filtersTypesToSqlValueQuoted = {
            match: '\'',
            exclude: '\'',
            from: '',
            to: ''
        }
        // assert correctness of previous
        // Mapping search params to categoraized key, value pairs
        const filterTypesRegex= new RegExp(filterTypes.map((t) => `(.*-${t})`).join('|'));
        const filterParams = Object.entries(params).filter(([k, v]) => k.match(filterTypesRegex));
    
        for (let [filedNameAndFilterType, value] of Object.entries(params)) {
            const [fieldName, filterType] = filedNameAndFilterType.split('-');
            if (Array.isArray(value)) {
                value = value[0];
                // TODO
            }
            if (filterType in filtersTypesToParams) {
                filtersTypesToParams[filterType].push({ fieldName, value })
            } 
        }
        
        // Joining previous to sql clause
        const sqlWhereClause = Object.keys(filtersTypesToParams)
            .map((t) => {
                const qt = filtersTypesToSqlValueQuoted[t];
                const operand = filtersTypesToSqlOperand[t];
                return filtersTypesToParams[t]
                    .map(({ queryParam, value }) => `"${queryParam}" ${operand} ${qt}${value}${qt}`)
                    .join("AND");})
            .filter((clause) => clause?.length > 0)
            .join("AND");

 
        return sqlWhereClause?.length > 0 ? `WHERE ${sqlWhereClause}` : '';
    }

    static build(params) {
        
        const dataSubsetQueryPart = (params) => params[DRP.countRecords] === 'true' ? '' :
            `LIMIT ${params[DRP.rowsOnSite]} OFFSET ${params[DRP.rowsOnSite] * (params[DRP.site] - 1)}`;

        const orderingPart = (params) => {
            if (!params['sorting']) {
                return '';
            }
            const { sorting } = params;
            if (sorting.startsWith('-')) {
                const field = sorting.slice(1)
                return `ORDER BY ${field} DESC`;
            } else {
                const field = sorting
                return `ORDER BY ${field} ASC`;
            }
        }

        const viewName = pageToViewName[params.page]
        const viewGen = views[viewName]

        return `WITH ${viewName} AS (
                    ${viewGen(params)})
                SELECT *
                FROM ${viewName}
                ${QueryBuilder.filteringPart(params)}
                ${orderingPart(params)}
                ${dataSubsetQueryPart(params)};`;
    }

}

module.exports = QueryBuilder;
