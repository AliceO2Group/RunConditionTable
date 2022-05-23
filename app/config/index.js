const path = require('path');
const ResProvider = require('../lib/ResProvider.js');

module.exports = {
    jwt: {
        secret: 'supersecret',
        expiration: '10m',
    },
    http: {
        port: 8081,
        hostname: 'localhost',
        tls: false,
        autoListen: false,
    },
    openId: ResProvider.openid(),
    winston: {
        file: path.join(__dirname, '..', '..', 'reports/logs.txt'),
    },
    database: {
        host: 'database',
        database: 'rct-db',
        user: 'rct-user',
        password: 'rct-passwd',
        port: 5432,
    },
    services: {
        bookkeeping: {
            url: {
                rct: 'http://rct-bookkeeping.cern.ch:4000/api/runs',
                ali: 'https://ali-bookkeeping.cern.ch/api/runs',
            },
        },
        monalisa: {
            url: {
                rawData: 'https://alimonitor.cern.ch/production/raw.jsp?res_path=json',
                // eslint-disable-next-line max-len
                rawDataDetalied: 'https://alimonitor.cern.ch/production/raw_details.jsp?timesel=0&filter_jobtype=OCT+-+async+production+for+pilot+beam+pass+3%2C+O2-2763&res_path=json',
            },
        },
    },

    public: require('./public.js'),
};

// TODO config validation
