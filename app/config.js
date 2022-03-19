const matchExcludeType = "match-exclude-type"
const fromToType = "from-to-type"

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
        dbname: 'rct-db-v3',
        dbuser: 'rct-user',
        port: 5432,

    },
    bookkeepingRuns: {
        url: 'http://rct-bookkeeping.cern.ch:4000/api/runs'
    },
    dev: {
        proxy: 'socks://localhost:12345'
    },

    public: {   // properties that will be provided to frontend in the public folder
        endpoints: {
            login: "/login/",
            logout: "/logout/",
            rctData: "/RCT-Data/",
            insertData: "/Rct-Data/insert-data/",
            authControl: "/auth-control/",
            date: "/date/",
            bookkeeping: "/bookkeeping/"
        },
        methods: {
            login: "post",
            logout: "post",
            rctData: "get",
            date: "get",
            insertData: "post",
            authControl: "get"
        },

        dataReqParams: {
            countRecords: "count-records",
            site: "site",
            rowsOnSite: "rows-on-site"
        },

        dataRespondFields: {
            totalRowsCount: "totalRowsCount",
            rows: "rows",
            fields: "fields"
        },

        pagesNames: {
            periods: "periods",
            dataPasses: "dataPasses",
            mc: "mc",
            runsPerPeriod: "runsPerPeriod",
            flags: "flags"
        },

        filteringParams: {
            types: {
                matchExcludeType : matchExcludeType,
                fromToType : fromToType            
            },
            pages: {
                periods: {
                    name: matchExcludeType,
                    year: fromToType,
                    beam: matchExcludeType,
                    energy: fromToType
                },
                runsPerPeriod: {
                    name : matchExcludeType,
                    run_number : fromToType, 
                    start : fromToType, 
                    end : fromToType, 
                    B_field : matchExcludeType, 
                    energy_per_beam : fromToType, 
                    IR : matchExcludeType, 
                    filling_scheme : fromToType, 
                    triggers_conf : matchExcludeType,
                    fill_number : fromToType, 
                    runType : matchExcludeType, 
                    mu : matchExcludeType, 
                    timeTrgStart : fromToType, 
                    timeTrgEnd : fromToType,
                },
    
                mc: {
                    name : matchExcludeType,
                    description : matchExcludeType, 
                    jira : matchExcludeType, 
                    ML : matchExcludeType, 
                    PWG	: matchExcludeType,
                    number_of_events : fromToType,
                },
    
                dataPasses: {
                    name : matchExcludeType,
                    description : matchExcludeType,	
                    pass_type : matchExcludeType,	
                    jira : matchExcludeType,	
                    ML : matchExcludeType,	
                    number_of_events : fromToType,	
                    software_version : matchExcludeType,	
                    size : fromToType,
                },
    
                flags: { 
                    start : fromToType, 
                    end : fromToType, 
                    flag : matchExcludeType, 
                    comment : matchExcludeType, 
                    production_id : fromToType,
                    name : matchExcludeType
                }
            },

        }
    }
};


const pagesNames = {
    periods: "periods",
    dataPasses: "dataPasses",
    mc: "mc",
    runsPerPeriod: "runsPerPeriod",
    flags: "flags"
}


// TODO config validation
