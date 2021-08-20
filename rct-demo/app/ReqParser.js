class ReqParser {

    constructor() {}

    parse(query) {
        const dataSubsetQueryPart = (query) => query['count-records'] === 'true' ? '' : `LIMIT ${query.rowsOnPage} OFFSET ${query.rowsOnPage * (query.page - 1)}`;
        switch (query.view) {
            case 'periods':
                return `SELECT * FROM ${query.view} ${dataSubsetQueryPart(query)};`;
            case 'mc':
                return `SELECT * FROM ${query.view} ${dataSubsetQueryPart(query)};`;
            case 'runs':
                return `SELECT * FROM ${query.view} WHERE period_id = (SELECT id FROM periods WHERE periods.period = '${query.period}') ${dataSubsetQueryPart(query)};`;
            default:
                return 'SELECT NOW()';
        }
    }
}

module.exports = ReqParser;