/**
 * here are private properties for backend */


module.exports = {
    jwt: {
      secret: 'supersecret',
      expiration: '10m'
    },
    http: {
      port: 8081,
      hostname: 'localhost',
      tls: false
    },
    database: {
      hostname: 'localhost',
      port: 5432,
    },
    bookkeepingRuns: {
      url: 'http://rct-bookkeeping.cern.ch:4000/api/runs'
    },
    dev: {
      proxy: 'socks://localhost:12345'
    },
    public: {
      endpoints: {
        "login": "/login/",
        "logout": "/logout/",
        "rctData": "/RCT-Data/",
        "insertData": "/Rct-Data/insert-data/",
        "authControl": "/auth-control/",
        "date": "/date/",
        "bookkeeping": "/bookkeeping/"
      },
      methods: {
        "login": "post",
        "logout": "post",
        "rctData": "get",
        "date": "get",
        "insertData": "post",
        "authControl": "get"    
      },
    
      dataReqParams: {
        "countRecords": "count-records",
        "site": "site",
        "rowsOnSite": "rows-on-site"
      },
      
      dataRespondFields: {
        "totalRowsCount": "totalRowsCount",
        "rows": "rows",
        "fields": "fields"
      },
    
      pagesNames: {
        "periods": "periods",
        "dataPasses": "dataPasses",
        "mc": "mc",
        "runsPerPeriod": "runsPerPeriod",
        "flags": "flags"
      }
    }
};