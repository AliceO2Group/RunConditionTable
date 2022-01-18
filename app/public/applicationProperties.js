
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
    pageNames: {
        periods: 'periods',
        dataPasses: 'dataPasses',
        mc: 'mc',
        runsPerPeriod: 'runsPerPeriod',
        flags: 'flags',

    }
}

export default applicationProperties