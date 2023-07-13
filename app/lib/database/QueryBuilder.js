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
const { adjustValuesToSql, switchCase } = require('../utils');

const { pageNames: PN, procedures: PC, filterTypes } = config.public;
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

const ops = {
    NOTLIKE: 'NOT LIKE',
    LIKE: 'LIKE',
    IN: 'IN',
    NOTIN: 'NOT IN',
    FROM: '>=',
    TO: '<=',
    BETWEEN: 'BETWEEN',
};

//match take precedens
const filtersControlTree = {
    notarray: {
        match: {
            string: [ops.LIKE, ops.OR],
            number: [ops.EQ, ops.OR],
        },
        exclude: {
            string: [ops.NOTLIKE, ops.AND],
            number: [ops.NE, ops.AND],
        },
        // from: [ops.FROM, ops.OR],
        // to: [ops.TO, ops.OR],
        between: [ops.BETWEEN, ops.OR],
    },

    array: {
        match: {
            string: [ops.LIKE, ops.OR],
            number: [ops.IN, ops.OR],
        },
        exclude: {
            string: [ops.NOTLIKE, ops.AND],
            number: [ops.NOTIN, ops.AND],
        },
        // from: [ops.FROM, ops.OR],
        // to: [ops.TO, ops.OR],
    },
}

const handleBetween = (fieldName, pairsLi) => {
    return pairsLi.map((p) => {
        const value = p.split(',');
        const [left, right] = adjustValuesToSql(value);
        if (value[0] && value[1]) {
            return `${fieldName} BETWEEN ${left} AND ${right}`;
        } else if (value[0]) {
            return `${fieldName} >= ${left}`;
        } else if (value[1]) {
            return `${fieldName} <= ${right}`;
        }
    }).join(' OR ');
}

const handleLike = (fieldName, values, like) => {
    if (! Array.isArray(values)) {
        values = [values]
    }
    values = values.map((subv) => subv.split(',').map((v) => v.trim()).filter((v) => v)).flat()

    const notS = ! like ? 'NOT' : '';
    if (values.every((v) => isNaN(v))) {
        // assume that it is for patterns
        const valuesPattern = values.join('|');
        return `${fieldName} ${notS} SIMILAR TO '${valuesPattern}'`;
    } else if (values.every((v) => ! isNaN(v))) {
        // assumes that it is for numbers with 'in' clause
        const valuesList = values.join(',');
        return `${fieldName} ${notS} IN (${valuesList})`;
    }
}

// http://localhost:8081/?page=periods&rows-on-site=50&site=1&sorting=-name&year-between=2019,2022
// http://localhost:8081/?page=periods&rows-on-site=50&site=1&sorting=-name&year-between=2019,2022&year-between=1,2&name-match=LHC22,LHC23&name-match=LHC22%&year-exclude=2023&year-exclude=2024&run_number-match=1,2,3,4&name-exclude=LHC22%,LHC25%
// {
//     year: [ 'between', [ '2019,2022', '1,2' ] ],
//     name: [ 'match', [ 'LHC22,LHC23', 'LHC123' ] ]
//   }
  
class QueryBuilder {

    static filteringPart(params) {
        const filtersTypesToParams = {
            match: [],
            exclude: [],
            between: []
        }

        // assert correctness of previous
        // Mapping search params to categorized { key, value } pairs
        const filterTypesRegex= new RegExp(Object.keys(filterTypes).map((t) => `(.*-${t})`).join('|'));
        const filterParams = Object.entries(params)
            .filter(([k, v]) => k.match(filterTypesRegex))
            .map(([k, v]) => [...k.split('-'), v]);
        const fields2Filters = {};
        filterParams.forEach((l) => fields2Filters[l[0]] = [])
        filterParams.forEach((l) => fields2Filters[l[0]].push(l.slice(1)))

    
        // console.log(fields2Filters);


        const cll = Object.entries(fields2Filters).map(([fieldName, clauses]) => {
            return clauses.map((cl) => {
                const [filterType, values] = cl;
                console.log(fieldName, filterType, values)
                switch (filterType) {
                    case 'between':
                        return handleBetween(fieldName, values);
                    case 'match': 
                        return handleLike(fieldName, values, true);
                    case 'exclude':
                        return handleLike(fieldName, values, false);
                    default:
                        return "";
                }
            })

        })

        console.log(cll);



        for (let [filedNameAndFilterType, values] of filterParams) {
            // const [fieldName, filterType] = filedNameAndFilterType.split('-');

            // if (filterType == filterTypes.between) {

            // }

            // if (values.includes(',')) {
            //     values = values.split(',').map((v) => v.trim());
            // }
            // let isArr = Array.isArray(values);
            // let valueType;
            // if (isArr) {
            //     if (values.every((v) => isNaN(v))) {
            //         // assuume that it is for patterns and join to one big pattern
            //         values = values.join('|');
            //         valueType = 'string';
            //         isArr = false;
            //     } else if (values.every((v) => !isNaN(v))) {
            //         values = values.map((v) => Number(v));
            //         valueType = 'number';
            //     } else {
            //         filterType = '_';
            //         this.logger.warn(`incorrect request param ${filedNameAndFilterType} :: ${values}`);
            //     }
            // }
            // console.log(filedNameAndFilterType, value)
            
        
            // if (filterType in filtersTypesToParams) {
            //     filtersTypesToParams[filterType].push({ fieldName, value: values, isArr, valueType })
            // } 
        }

        // console.log(filtersTypesToParams)
        // console.log("===================")

        // const asdf = Object.entries(filtersTypesToParams).map(([t, pli]) => {
        //     return [t, pli.map(({fieldName, value, isArr, valueType}) => {
        //         console.log([t, fieldName, value, isArr, valueType])
        //         if (t == filterTypes.between) {
        //             const [left, right] = adjustValuesToSql(value);
        //             if (left && right) {
        //                 return `OR ${fieldName} BETWEEN ${left} AND ${right}`;
        //             } else if (left) {
        //                 return `OR ${fieldName} >= ${left}`;
        //             } else if (right) {
        //                 return `OR ${fieldName} <= ${right}`;
        //             }
        //         } else {
        //             const isarrstr = isArr ? 'array' : 'notarray';
        //             const [wop, lop] = switchCase([isarrstr, t, valueType], filtersControlTree)
        //             return `${lop} ${fieldName} ${wop} ${value}`;
        //         }
        //     })]
        // })
        // console.log(asdf)
        
        // Joining previous to sql clause
        // const sqlWhereClause = Object.keys(filtersTypesToParams)
        //     .map((t) => {
        //         const qt = filtersTypesToSqlValueQuoted[t];
        //         const operand = filtersTypesToSqlOperand[t];
        //         return filtersTypesToParams[t]
        //             .map(({ fieldName, value, isArr, type }) => `"${fieldName}" ${operand} ${qt}${value}${qt}`)
        //             .join("AND");})
        //     .filter((clause) => clause?.length > 0)
        //     .join("AND");

        return "";
        return sqlWhereClause?.length > 0 ? `WHERE ${sqlWhereClause}` : '';
    }

    static buildSelect(params) {

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
