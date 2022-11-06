const matchExcludeType = 'match-exclude-type';
const fromToType = 'from-to-type';

const runsViewsFilteringTypes = {
    name: matchExcludeType,
    run_number: fromToType,
    time_start: fromToType,
    time_end: fromToType,
    time_trg_start: fromToType,
    time_trg_end: fromToType,
    l3_current: fromToType,
    dipole_current: fromToType,
    energy_per_beam: fromToType,
    ir: fromToType,
    filling_scheme: fromToType,
    triggers_conf: matchExcludeType,
    fill_number: fromToType,
    run_type: matchExcludeType,
    mu: matchExcludeType,
};

const dataPassesViews = {
    name: matchExcludeType,
    description: matchExcludeType,
    pass_type: matchExcludeType,
    jira: matchExcludeType,
    ml: matchExcludeType,
    number_of_events: fromToType,
    software_version: matchExcludeType,
    size: fromToType,
};

const mcViews = {
    name: matchExcludeType,
    description: matchExcludeType,
    jira: matchExcludeType,
    ml: matchExcludeType,
    pwg: matchExcludeType,
    number_of_events: fromToType,
};

module.exports = { // Properties that will be provided to frontend in the public folder
    endpoints: {
        login: '/login/',
        logout: '/logout/',
        rctData: '/RCT-Data/',
        insertData: '/Rct-Data/insert-data/',
        authControl: '/auth-control/',
        date: '/date/',
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
        anchoredPerMC: 'anchoredPerMC',
        anchoragePerDatapass: 'anchoragePerDatapass',
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
            runsPerPeriod: runsViewsFilteringTypes,
            mc: mcViews,
            anchoredPerMC: dataPassesViews,
            anchoragePerDatapass: mcViews,
            dataPasses: dataPassesViews,
            runsPerDataPass: runsViewsFilteringTypes,

            flags: {
                start: fromToType,
                end: fromToType,
                flag: matchExcludeType,
                comment: matchExcludeType,
                production_id: fromToType,
                name: matchExcludeType,
            },
        },

    },
};
