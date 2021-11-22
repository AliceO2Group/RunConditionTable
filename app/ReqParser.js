/**
 * class responsible for parsing url params, payloads of client request to sql queries
 */
class ReqParser {

    constructor() {}

    parseDataReq(query) {
        const dataSubsetQueryPart = (query) => query['count-records'] === 'true' ? '' : `LIMIT ${query.rowsOnPage} OFFSET ${query.rowsOnPage * (query.page - 1)}`;
        switch (query.view) {
            case 'periods':
                return `SELECT * FROM ${query.view} ${dataSubsetQueryPart(query)};`;
            case 'mc':
                return `SELECT * FROM ${query.view} ${dataSubsetQueryPart(query)};`;
            case 'runs':
                return `SELECT * FROM ${query.view} WHERE period_id = (SELECT id FROM periods WHERE periods.period = '${query.period}') ${dataSubsetQueryPart(query)};`;
            case 'flags':
                return `SELECT * FROM ${query.view} WHERE run_id = ${query.run_id} ${dataSubsetQueryPart(query)};`;
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