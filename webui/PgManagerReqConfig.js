



class PgManagerReqConfig {

//     switch (query.view) {
//     case 'periods': return`SELECT * FROM ${query.view} LIMIT ${query.rowsOnSite} OFFSET ${query.rowsOnSite * (query.site - 1)};`;
//     case 'mc': return`SELECT * FROM ${query.view} LIMIT ${query.rowsOnSite} OFFSET ${query.rowsOnSite * (query.site - 1)};`;
//     case 'runs': return `SELECT * FROM ${query.view} WHERE period_id = (SELECT id FROM periods WHERE periods.period = '${query.period}') LIMIT ${query.rowsOnSite} OFFSET ${query.rowsOnSite * (query.site - 1)};`;
//     default: return 'SELECT NOW()';
// }

}

module.export = PgManagerReqConfig;