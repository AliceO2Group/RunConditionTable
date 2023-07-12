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
const views = require('./views');
const procedures = require('./procedures')

const { pagesNames: PN, procedures: PC } = config.public;
const DRP = config.public.dataReqParams;

const pageToViewName = {};
pageToViewName[PN.periods] = 'periods_view'
pageToViewName[PN.runsPerPeriod] = 'runs_per_period_view'
pageToViewName[PN.runsPerDataPass] = 'runs_per_data_pass_view'
pageToViewName[PN.dataPasses] = 'data_passes_view'
pageToViewName[PN.anchoragePerDatapass] = 'anchorage_per_data_pass_view'
pageToViewName[PN.mc] = 'mc_view'
pageToViewName[PN.anchoredPerMC] = 'anchored_per_mc_view'
pageToViewName[PN.flags] = 'flags_view'
/**
 * Class responsible for parsing url params, payloads of client request to sql queries
 */


const filterTypes = ['match', 'exclude', 'from', 'to'];

const ops = {
    NOTLIKE: 'NOT LIKE',
    LIKE: 'LIKE',
    IN: 'IN',
    NOTIN: 'NOT IN',
    FROM: '>=',
    TO: '<=',
    EQ: '==',
    NE: '!=',
    AND: 'AND',
    OR: 'OR',
};

const filtersTypesToSqlOperand = {
    match: 'LIKE',
    exclude: 'NOT LIKE',
    from: '>=',
    to: '<='
}

const logicalOperandsPerFilters = {
    match: {
        string: ops.LIKE,
        number: ops.IN,
    },
    exclude: {
        string: ops.NOTLIKE,
        number: ops.NOTIN,
    },
    from: ops.FROM,
    to: ops.TO,
};

const filtersTypesToSqlValueQuoted = {
    match: '\'',
    exclude: '\'',
    from: '',
    to: ''
}

//match take precedens
const controlForNoArrays = {
    notarray: {
        match: {
            string: [ops.LIKE, ops.OR],
            number: [ops.EQ, ops.OR],
        },
        exclude: {
            string: [ops.NOTLIKE, ops.AND],
            number: [ops.NE, ops.AND],
        },
        from: [ops.FROM, ops.AND],
        to: [ops.TO, ops.AND],
    },

    array: {
        match: {
            string: ops.LIKE,
            number: ops.EQ,
        },
        exclude: {
            string: ops.NOTLIKE,
            number: ops.NE,
        },
        from: ops.FROM,
        to: ops.TO,
    },
}


class QueryBuilder {

    static filteringPart(params) {
        const filtersTypesToParams = {
            match: [],
            exclude: [],
            from: [],
            to: []
        }

        // Mapping search params to categorized { key, value } pairs
        const filterTypesRegex= new RegExp(filterTypes.map((t) => `(.*-${t})`).join('|'));
        const filterParams = Object.entries(params).filter(([k, v]) => k.match(filterTypesRegex));
    
        for (let [filedNameAndFilterType, value] of Object.entries(filterParams)) {
            const [fieldName, filterType] = filedNameAndFilterType.split('-');
            if (! Array.isArray(value) && /.*,.*/.test(value)) {
                value = value.split(',').map((s) => s.trim())
            }
            if (filterType in filtersTypesToParams) {
                filtersTypesToParams[filterType].push({ fieldName, value })
            } 
        }

        // console.log(filtersTypesToParams)

        // Object.entries(filtersTypesToParams).map(([t, pli]) => {
        //     pli.map(([fN, fv]) => {
        //         if (t 
        //     })
        // })
        
        // Joining previous to sql clause
        const sqlWhereClause = Object.keys(filtersTypesToParams)
            .map((t) => {
                const qt = filtersTypesToSqlValueQuoted[t];
                const operand = filtersTypesToSqlOperand[t];
                return filtersTypesToParams[t]
                    .map(({ fieldName, value }) => `"${fieldName}" ${operand} ${qt}${value}${qt}`)
                    .join("AND");})
            .filter((clause) => clause?.length > 0)
            .join("AND");

 
        return sqlWhereClause?.length > 0 ? `WHERE ${sqlWhereClause}` : '';
    }

    static buildSelect(params) {
        // console.log(params)
        delete params.aaa;

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

        const a = `WITH ${viewName} AS (
                    ${viewGen(params)})
                SELECT *
                FROM ${viewName}
                ${QueryBuilder.filteringPart(params)}
                ${orderingPart(params)}
                ${dataSubsetQueryPart(params)};`;
        // console.log(a);
        return a;
    }

    static buildInsertOrUpdate(params) {
        return procedures[params.procedure](params)
    }
}

module.exports = QueryBuilder;
