const matchExcludeType = 'match-exclude-type';
const fromToType = 'from-to-type';

module.exports = {
    jwt: {
        secret: process.env.RCT_JWT_SECRET,
        expiration: '10m',
    },
    http: {
        port: 8081,
        hostname: 'localhost',
        tls: false,
        autoListen: false,
    },
    database: {
        hostname: process.env.RCT_DB_HOST,
        dbname: process.env.RCT_DB_NAME,
        dbuser: process.env.RCT_DB_USERNAME,
        password: process.env.RCT_DB_PASSWORD,
        port: 5432,
    },
    bookkeepingRuns: {
        url: 'http://rct-bookkeeping.cern.ch:4000/api/runs',
    },
    dev: {
        proxy: 'socks://localhost:12345',
    },
    openId: {
        secret: process.env.RCT_OPENID_SECRET,
        id: process.env.RCT_OPENID_ID,
        redirect_uri: process.env.RCT_OPENID_REDIRECT,
        well_known: 'https://auth.cern.ch/auth/realms/cern/.well-known/openid-configuration',
    },

    public: { // Properties that will be provided to frontend in the public folder
        endpoints: {
            login: '/login/',
            logout: '/logout/',
            rctData: '/RCT-Data/',
            insertData: '/Rct-Data/insert-data/',
            authControl: '/auth-control/',
            date: '/date/',
            bookkeeping: '/bookkeeping/',
        },

        methods: {
            login: 'post',
            logout: 'post',
            rctData: 'get',
            date: 'get',
            insertData: 'post',
            authControl: 'get',
        },

        dataReqParams: {
            countRecords: 'count-records',
            site: 'site',
            rowsOnSite: 'rows-on-site',
        },

        dataRespondFields: {
            totalRowsCount: 'totalRowsCount',
            rows: 'rows',
            fields: 'fields',
        },

        pagesNames: {
            periods: 'periods',
            dataPasses: 'dataPasses',
            mc: 'mc',
            runsPerPeriod: 'runsPerPeriod',
            runsPerDataPass: 'runsPerDataPass',
            flags: 'flags',
        },

        filteringParams: {
            types: {
                matchExcludeType: matchExcludeType,
                fromToType: fromToType,
            },
            pages: {
                periods: {
                    name: matchExcludeType,
                    year: fromToType,
                    beam: matchExcludeType,
                    energy: fromToType,
                },

                runsPerPeriod: {
                    name: matchExcludeType,
                    run_number: fromToType,
                    start: fromToType,
                    ende: fromToType,
                    B_field: matchExcludeType,
                    energy_per_beam: fromToType,
                    IR: matchExcludeType,
                    filling_scheme: fromToType,
                    triggers_conf: matchExcludeType,
                    fill_number: fromToType,
                    runType: matchExcludeType,
                    mu: matchExcludeType,
                    timeTrgStart: fromToType,
                    timeTrgEnd: fromToType,
                },

                mc: {
                    name: matchExcludeType,
                    description: matchExcludeType,
                    jira: matchExcludeType,
                    ML: matchExcludeType,
                    PWG: matchExcludeType,
                    number_of_events: fromToType,
                },

                dataPasses: {
                    name: matchExcludeType,
                    description: matchExcludeType,
                    pass_type: matchExcludeType,
                    jira: matchExcludeType,
                    ML: matchExcludeType,
                    number_of_events: fromToType,
                    software_version: matchExcludeType,
                    size: fromToType,
                },

                flags: {
                    start: fromToType,
                    ende: fromToType,
                    flag: matchExcludeType,
                    comment: matchExcludeType,
                    production_id: fromToType,
                    name: matchExcludeType,
                },
            },
        },
    },
};

// TODO config validation
