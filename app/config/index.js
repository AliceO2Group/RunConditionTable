const ResProvider = require('../lib/ResProvider.js');

module.exports = {
    // Web-Ui config
    http: ResProvider.http(),
    jwt: ResProvider.jwt(),
    openId: ResProvider.openid(),

    // App config
    winston: ResProvider.winston(),
    database: ResProvider.database(),
    databasePersistance: require('./databasePersistance.js'),
    public: require('./public.js'),

    // RCT data config
    dataFromYearIncluding: 2015,

    // Other config
    errorsLoggingDepths: {
        no: () => null,
        message: (logger, er) => logger.error(er.message),
        stack: (logger, er) => logger.error(er.stack),
        object: (logger, er) => logger.error(JSON.stringify(er, null, 2)),
    },
    defaultErrorsLogginDepth: 'object',
};
