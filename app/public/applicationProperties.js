/**
 * here are defined public application properties
 * */


const applicationProperties = {
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
        runsPerPeriod: 'runsPerPeriod',
        flags: 'flags',

    }
}

module.exports = applicationProperties
// export default applicationProperties