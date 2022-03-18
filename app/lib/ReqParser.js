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




/**
 * class responsible for parsing url params, payloads of client request to sql queries
 */

const config = require('./config/configProvider.js');
const pagesNames = config.public.pagesNames;
const DRP = config.public.dataReqParams;
const filteringParams = config.public.filteringParams;

const period_view = `WITH period_view AS (
    SELECT name, year, (
                        SELECT beam_type
                        FROM beams_dictionary
                        AS bd where bd.id = p.beam_type_id
                    ) AS beam,
                    (
                        SELECT string_agg(distinct energy_per_beam, ', ')
                        FROM runs as r
                        WHERE r.period_id = p.id
                        GROUP BY r.period_id
                    ) AS energy
    FROM periods AS p
    )`;

const runs_per_period_view = (query) => `WITH runs_per_period_view AS (
    SELECT p.name, r.run_number, r.start, r.end, r."B_field", r.energy_per_beam, r."IR", r.filling_scheme, r.triggers_conf,
        r.fill_number, r."runType", r.mu, r."timeTrgStart", r."timeTrgEnd"
    FROM runs AS r
        INNER JOIN periods AS p
        ON p.id = r.period_id
    WHERE period_id = (
                        SELECT id 
                        FROM periods 
                        WHERE periods.name = '${query.index}'
                        )
)`;

const data_passes_view = (query) => `WITH data_passes_view AS (
    SELECT *
    FROM data_passes AS dp
    WHERE exists (
                    SELECT *
                    FROM runs AS r
                    INNER JOIN
                    data_passes_runs AS dpr
                        ON r.id = dpr.run_id
                    INNER JOIN data_passes AS dp
                        ON dp.id = dpr.production_id
                    WHERE r.period_id = (
                                        SELECT id 
                                        FROM periods AS p 
                                        WHERE p.name = \'${query.index}\')
                                        )
)`;

const mc_view = (query) => `WITH mc_view AS (
    SELECT * 
    FROM simulation_passes AS sp 
    WHERE exists (
                    SELECT * 
                    FROM runs AS r 
                    INNER JOIN simulation_passes_runs AS spr 
                        ON r.id = spr.run_id 
                    INNER JOIN simulation_passes AS sp 
                        ON sp.id = spr.simulation_pass_id 
                    WHERE r.period_id = (
                                        SELECT id 
                                        FROM periods as p 
                                        WHERE p.name = \'${query.index}\'
                                        )
                    ) 
)`;

class ReqParser {

    constructor() {}

    parseDataReq(query) {
        console.log(query);

        const page = query.page;

        let matchParams = [];
        let excludeParams = [];
        let fromParams = [];
        let toParams = [];

        for (const [key, value] of Object.entries(query)) {
            const queryParam = key.substr(0, key.lastIndexOf('-'));
            if (key.includes('match')) {
                matchParams.push({queryParam, value});
            }
        
            if (key.includes('exclude')) {
                excludeParams.push({queryParam, value});
            }
            
            if (key.includes('from')) {
                fromParams.push({queryParam, value});
            }

            if (key.includes('to') && key !== 'token') {
                toParams.push({queryParam, value});
            }
        }

        const filteringPart = () => {
            const matchPhrase = matchParams.map((filter) =>
                `${filter.queryParam} LIKE '${filter.value}'`
            ).join(' AND ');

            const excludePhrase = excludeParams.map(({queryParam, value}) =>
                `${queryParam} NOT LIKE '${value}'`
            ).join(' AND ');

            const fromPhrase = fromParams.map(({queryParam, value}) =>
                `${queryParam} >= '${value}'`
            ).join(' AND ');

            const toPhrase = toParams.map(({queryParam, value}) =>
                `${queryParam} <= '${value}'`
            ).join(' AND ');

            const filtersPhrase = [matchPhrase, excludePhrase, fromPhrase, toPhrase].filter(
                    value => {return value?.length > 0}
                ).join(' AND ');
            
            return filtersPhrase?.length > 0 ? `WHERE ${filtersPhrase}` : '';
        }

        const dataSubsetQueryPart = (query) => query[DRP.countRecords] === 'true' ? '' :
            `LIMIT ${query[DRP.rowsOnSite]} OFFSET ${query[DRP.rowsOnSite] * (query[DRP.site] - 1)}`;

        switch (query.page) {
            case pagesNames.periods:
                return `${period_view}
                        SELECT name, year, beam, energy
                        FROM period_view
                        ${filteringPart()}
                        ${dataSubsetQueryPart(query)};`;

            case pagesNames.runsPerPeriod:
                return `${runs_per_period_view(query)}
                        SELECT *
                        FROM runs_per_period_view
                         ${dataSubsetQueryPart(query)};`;

            case pagesNames.dataPasses:
                return `${data_passes_view(query)}
                        SELECT *
                        FROM data_passes_view
                        ${dataSubsetQueryPart(query)};`;

            case pagesNames.mc:
                return `${mc_view(query)}
                        SELECT * 
                        FROM mc_view
                        ${dataSubsetQueryPart(query)};`;

            // case 'flags':
            //     return `SELECT * FROM ${query.view} WHERE run_id = ${query.run_id} ${dataSubsetQueryPart(query)};`;
            default:
                return 'SELECT NOW()';
        }
    }

    parseInsertDataReq(payload) {
        const valueEntries = Object.entries(payload.data);
        const keys = valueEntries.map(([k, v]) => k);
        const values = valueEntries.map(([k, v]) => v);
        return `INSERT INTO ${payload.targetTable}("${keys.join('\", \"')}") VALUES(${parseValues(values).join(', ')});`;
    }
}

const parseValues = (values) => {
    return values.map(v => {
        if (isNaN(v) && v !== 'DEFAULT')
            return `\'${v}\'`;
        else
            return v;
    })
}

module.exports = ReqParser;
