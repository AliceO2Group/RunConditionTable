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

const period_view = `
    WITH period_view AS (
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

const runs_per_period_view = (query) => `
    WITH runs_per_period_view AS (
    SELECT *
    FROM runs
    WHERE period_id = (
                        SELECT id 
                        FROM periods 
                        WHERE periods.name = '${query.index}'
                        )
    )`;

const data_passes_view = (query) => `
    WITH data_passes_view AS (
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

const mc_view = (query) => `
    WITH mc_view AS (
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

const flags_view = (query) => `
    WITH flags_view AS (
        SELECT 
            qcf.id, 
            qcf.start, 
            qcf.end, 
            ftd.flag, 
            qcf.comment, 
            dpr.production_id,
            ds.name

        FROM quality_control_flags AS qcf
        INNER JOIN data_passes_runs as dpr
            ON dpr.id = qcf.pass_run_id
        INNER JOIN runs_detectors as rd
            ON qcf.run_detector_id = rd.id
        INNER JOIN detectors_subsystems AS ds
            ON ds.id = rd.detector_id
        INNER JOIN flags_types_dictionary as ftd
            ON ftd.id = qcf.flag_type_id
        
        WHERE rd.run_id = ${query.index}
        
    )`;

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
            if (filteringParams[page]) {
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
        }

        const filteringPart = (query) => {
            if (matchParams.length > 0) {
                console.log(matchParams);

                let output = 'WHERE ';
                matchParams.forEach(({queryParam, value}) => {
                    output += `${queryParam}='${value}'`;
                });
                console.log(output);
                return output;
            } else return '';
        }

        const dataSubsetQueryPart = (query) => query[DRP.countRecords] === 'true' ? '' :
            `LIMIT ${query[DRP.rowsOnSite]} OFFSET ${query[DRP.rowsOnSite] * (query[DRP.site] - 1)}`;

        switch (query.page) {
            case pagesNames.periods:
                return `${period_view}
                        SELECT name, year, beam, energy
                        FROM period_view
                        ${filteringPart(query)}
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

            case pagesNames.flags:
                return `${flags_view(query)}
                        SELECT * 
                        FROM flags_view
                        ${dataSubsetQueryPart(query)};`;

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