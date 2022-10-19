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

const { Log } = require('@aliceo2/web-ui');
const config = require('../config/configProvider.js');
const views = require("./viewsDefinitions.js") 
const { pagesNames } = config.public;
const DRP = config.public.dataReqParams;
const Utils = require("../Utils.js");

/**
 * Class responsible for parsing url params, payloads of client request to sql queries
 */
class QueryBuilder {
    static build(params) {
        const matchParams = [];
        const excludeParams = [];
        const fromParams = [];
        const toParams = [];

        for (const [key, value] of Object.entries(params)) {
            const queryParam = key.substring(0, key.lastIndexOf('-'));
            if (key.includes('match')) {
                matchParams.push({ queryParam, value });
            }

            if (key.includes('exclude')) {
                excludeParams.push({ queryParam, value });
            }

            if (key.includes('from')) {
                fromParams.push({ queryParam, value });
            }

            if (key.includes('to') && key !== 'token') {
                toParams.push({ queryParam, value });
            }
        }

        const filteringPart = () => {
            const matchPhrase = matchParams.map((filter) =>
                `"${filter.queryParam}" LIKE '${filter.value}'`).join(' AND ');

            const excludePhrase = excludeParams.map(({ queryParam, value }) =>
                `"${queryParam}" NOT LIKE '${value}'`).join(' AND ');

            const fromPhrase = fromParams.map(({ queryParam, value }) =>
                `"${queryParam}" >= ${value}`).join(' AND ');

            const toPhrase = toParams.map(({ queryParam, value }) =>
                `"${queryParam}" <= ${value}`).join(' AND ');

            const filtersPhrase = [matchPhrase, excludePhrase, fromPhrase, toPhrase].filter((value) => value?.length > 0).join(' AND ');

            return filtersPhrase?.length > 0 ? `WHERE ${filtersPhrase}` : '';
        };

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

        const cases = {};
        cases[pagesNames.periods] = 
        `${views.period_view}
        SELECT name, year, beam, energy
        FROM period_view
        `;
        cases[pagesNames.runsPerPeriod] = 
        `${views.runs_per_period_view(params)}
        SELECT *
        FROM runs_per_period_view 
        `;
        cases[pagesNames.runsPerDataPass] =
        `${views.runs_per_data_pass_view(params)}
        SELECT *
        FROM runs_per_data_pass_view 
        `;
        cases[pagesNames.dataPasses] = 
        `${views.data_passes_view(params)}
        SELECT * 
        FROM data_passes_view
        `;
        cases[pagesNames.anchoragePerDatapass] = 
        `${views.anchorage_per_data_pass_view(params)}
        SELECT *
        FROM anchorage_per_data_pass_view
        `;
        cases[pagesNames.mc] = 
        `${views.mc_view(params)}
        SELECT * 
        FROM mc_view 
        `;
        cases[pagesNames.anchoredPerMC] = 
        `${views.anchored_per_mc_view(params)}
        SELECT *
        FROM anchored_per_mc_view
        `;
        cases[pagesNames.flags] = 
        `${views.flags_view(params)}
        SELECT * 
        FROM flags_view 
        `;

        const queryRest = () => 
        `${filteringPart()}
        ${orderingPart(params)}
        ${dataSubsetQueryPart(params)}`;

        return `${Utils.switchCase(params.page, cases, null)} ${queryRest()};`;
        
    }

}

module.exports = QueryBuilder;
