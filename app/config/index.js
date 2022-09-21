const path = require('path');
const ResProvider = require('../lib/ResProvider.js');

module.exports = {
    jwt: {
        secret: process.env.RCT_JWT_SECRET,
        expiration: process.env.RCT_JWT_EXPIRATION,
    },
    http: {
        port: process.env.RCT_HTTP_PORT,
        hostname: process.env.RCT_HOSTNAME,
        tls: process.env.RCT_TLS_ENABLED == 'true' ? true : false,
        autoListen: false,
    },
    openId: ResProvider.openid(),
    winston: {
        file: path.join(__dirname, '..', '..', 'reports/logs.txt'),
    },
    database: ResProvider.database(),

    public: require('./public.js'),

    dataFromYearIncluding: 2021,

    defaultLoglev: 1,
};

// TODO config validation
