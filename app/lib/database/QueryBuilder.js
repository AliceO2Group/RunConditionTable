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

/**
 * Class responsible for parsing url params, payloads of client request to sql queries
 */
class QueryBuilder {
    constructor() {
        this.logger = new Log(QueryBuilder.name);
    }

    build(params) {
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

        switch (params.page) {
            case pagesNames.periods:
                return `${views.period_view}
                        SELECT name, year, beam, string_agg(energy::varchar, ',') as energy
                        FROM period_view
                        ${filteringPart()}
                        GROUP BY name, year, beam
                        ${dataSubsetQueryPart(params)};`;

            case pagesNames.runsPerPeriod:
                return `${views.runs_per_period_view(params)}
                        SELECT *
                        FROM runs_per_period_view
                        ${filteringPart()}
                        ${dataSubsetQueryPart(params)};`;

            case pagesNames.dataPasses:
                return `${views.data_passes_view(params)}
                        SELECT *
                        FROM data_passes_view
                        ${filteringPart()}
                        ${dataSubsetQueryPart(params)};`;

            case pagesNames.mc:
                return `${views.mc_view(params)}
                        SELECT * 
                        FROM mc_view
                        ${filteringPart()}
                        ${dataSubsetQueryPart(params)};`;

            case pagesNames.flags:
                return `${views.flags_view(params)}
                        SELECT * 
                        FROM flags_view
                        ${filteringPart()}
                        ${dataSubsetQueryPart(params)};`;

            default:
                return 'SELECT NOW()';
        }
    }

    parseInsertDataReq(payload) {
        const valueEntries = Object.entries(payload.data);
        const keys = valueEntries.map(([k, _]) => k);
        const values = valueEntries.map(([_, v]) => v);
        return `INSERT INTO ${payload.targetTable}("${keys.join('", "')}") VALUES(${parseValues(values).join(', ')});`;
    }
}

const parseValues = (values) => values.map((v) => {
    if (isNaN(v) && v !== 'DEFAULT') {
        return `'${v}'`;
    } else {
        return v;
    }
});

module.exports = QueryBuilder;