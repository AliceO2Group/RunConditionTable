class ReqParser {

    constructor() {}

    parseDataReq(query) {
        const dataSubsetQueryPart = (query) => query['count-records'] === 'true' ? '' : `LIMIT ${query.rowsOnSite} OFFSET ${query.rowsOnSite * (query.site - 1)}`;
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
        return `INSERT INTO ${payload.view}(${keys.join(', ')}) VALUES(${values.join(', ')});`;
    }
}

module.exports = ReqParser;