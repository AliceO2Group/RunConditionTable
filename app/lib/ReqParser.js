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

class ReqParser {

    constructor() {}

    parseDataReq(query) {
        console.log(query);

        const page = query.page;
        console.log(page);

        let filtering = false;
        let matchParams = [];
    //  let excludeParams = [];

        for (const [key, value] of Object.entries(query)) {
            for (const [filterKey, filterValue] of Object.entries(filteringParams[page])) {
                if (key === filterValue) {
                    const queryParam = filterValue.substr(0, filterValue.lastIndexOf('-'));
                    console.log(queryParam);
                    matchParams.push({queryParam, value});

                    console.log(`requested ${queryParam} = ${value}`);
                    filtering = true;
                }
            }
        }

        const filteringPart = (query) => {
            if (matchParams.length > 0) {
                console.log(matchParams);

                let output = 'WHERE ';
                matchParams.forEach(({queryParam, value}) => {
                    output += `${query.page}.${queryParam}='${value}'`;
                });
                console.log(output);
                return output;
            } else return '';
        }

        const dataSubsetQueryPart = (query) => query[DRP.countRecords] === 'true' ? '' :
            `LIMIT ${query[DRP.rowsOnSite]} OFFSET ${query[DRP.rowsOnSite] * (query[DRP.site] - 1)}`;

        switch (query.page) {
            case pagesNames.periods:
                const v = query.page;
                return `SELECT name, year, (SELECT beam_type from beams_dictionary as bd where bd.id = ${v}.beam) as beam, energy
                        FROM ${v}
                        ${filteringPart(query)}
                        ${dataSubsetQueryPart(query)};`;
            case pagesNames.runsPerPeriod:
                return `SELECT *
                        FROM runs
                        WHERE period_id = (SELECT id FROM periods WHERE periods.name = '${query.index}')
                         ${dataSubsetQueryPart(query)};`;
            case pagesNames.dataPasses:
                return `SELECT *
                        FROM data_passes as dp
                        WHERE exists (
                                    SELECT *
                                    from runs as r
                                    INNER JOIN
                                    data_passes_runs as dpr
                                        ON r.id = dpr.run_id
                                    INNER JOIN data_passes as dp
                                        ON dp.id = dpr.production_id
                                    WHERE r.period_id = (
                                                        SELECT id FROM periods AS p where p.name = \'${query.index}\')
                                                        )
                                    ${dataSubsetQueryPart(query)};`;
            case pagesNames.mc:
                return `SELECT * FROM simulation_passes as sp where exists (select * from runs as r inner join simulation_passes_runs as spr on r.id = spr.run_id INNER JOIN simulation_passes as sp on sp.id = spr.simulation_pass_id where r.period_id = (select id from periods as p where p.name = \'${query.index}\')) ${dataSubsetQueryPart(query)};`;

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