const ResProvider = require('../lib/ResProvider.js');

module.exports = {
    // Web-Ui config
    http: ResProvider.http(),
    jwt: ResProvider.jwt(),
    openId: ResProvider.openid(),

    // App config
    winston: ResProvider.winston(),
    database: ResProvider.database(),
    public: require('./public.js'),

    // External secured config
    external_secured_config: ResProvider.external_secured_config(),

    // Other config
    dataFromYearIncluding: 2015,
    defaultLoglev: 1,
};

// TODO config validation
