/**
 * class responsible for parsing url params, payloads of client request to sql queries
 */

// const RCT_DATA_PAGES = ['periods', 'runsPerPeriod', 'dataPasses', 'mc', 'flags'];

class ReqParser {

    constructor() {}

    parseDataReq(query) {
        const dataSubsetQueryPart = (query) => query['count-records'] === 'true' ? '' : `LIMIT ${query.rowsOnSite} OFFSET ${query.rowsOnSite * (query.site - 1)}`;
        switch (query.page) {
            case 'periods':
                return `SELECT name, year, (SELECT beam_type from beams_dictionary as bd where bd.id = v.beam) as beam, energy FROM periods as v ${dataSubsetQueryPart(query)};`;
            case 'runsPerPeriod':
                return `SELECT * FROM runs WHERE period_id = (SELECT id FROM periods WHERE periods.name = '${query.name}') ${dataSubsetQueryPart(query)};`;
            case 'dataPasses':
                return `SELECT * FROM data_passes as dp where exists (select * from runs as r inner join data_passes_runs as dpr on r.id = dpr.run_id INNER JOIN data_passes as dp on dp.id = dpr.production_id where r.period_id = (select id from periods as p where p.name = \'${query.name}\')) ${dataSubsetQueryPart(query)};`;
            case 'mc':
                return `SELECT * FROM simulation_passes as sp where exists (select * from runs as r inner join simulation_passes_runs as spr on r.id = spr.run_id INNER JOIN simulation_passes as sp on sp.id = spr.simulation_pass_id where r.period_id = (select id from periods as p where p.name = \'${query.name}\')) ${dataSubsetQueryPart(query)};`;

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
        console.log(v)
        if (isNaN(v) && v !== 'DEFAULT')
            return `\'${v}\'`
        else
            return v
    })
}

module.exports = ReqParser;