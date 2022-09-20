const path = require('path');
const ResProvider = require('../lib/ResProvider.js');

module.exports = {
    jwt: {
        secret: process.env.RCT_JWT_SECRET,
        expiration: process.env.RCT_JWT_EXPIRATION,
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
    database: ResProvider.database(),

    public: require('./public.js'),

    defaultLoglev: 5,
};

// TODO config validation
