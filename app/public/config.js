/* eslint-disable quote-props */
const publicConfig = {
  "endpoints": {
    "login": "/login/",
    "logout": "/logout/",
    "rctData": "/RCT-Data/",
    "insertData": "/Rct-Data/insert-data/",
    "authControl": "/auth-control/",
    "date": "/date/",
    "bookkeeping": "/bookkeeping/"
  },
  "methods": {
    "login": "post",
    "logout": "post",
    "rctData": "get",
    "date": "get",
    "insertData": "post",
    "authControl": "get"
  },
  "dataReqParams": {
    "countRecords": "count-records",
    "site": "site",
    "rowsOnSite": "rows-on-site"
  },
  "dataRespondFields": {
    "totalRowsCount": "totalRowsCount",
    "rows": "rows",
    "fields": "fields"
  },
  "pagesNames": {
    "periods": "periods",
    "dataPasses": "dataPasses",
    "mc": "mc",
    "runsPerPeriod": "runsPerPeriod",
    "flags": "flags"
  }
}; 
export {publicConfig as RCT};
