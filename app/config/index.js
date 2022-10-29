const ResProvider = require('../lib/ResProvider.js');

module.exports = {
    // Web-Ui config
    http: ResProvider.http(),
    jwt: ResProvider.jwt(),
    openId: ResProvider.openid(),

    // App config
    winston: ResProvider.winston(),
    database: ResProvider.database(),
    baseData: require('./baseData.js'),
    public: require('./public.js'),

    // Other config
    dataFromYearIncluding: 2015,
    defaultLoglev: 1,
};

// TODO config validation
