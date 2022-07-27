const path = require('path');
const ResProvider = require('../lib/ResProvider.js');

module.exports = {
    jwt: {
        secret: process.env.RCT_JWT_SECRET,
        expiration: '2m',
    },
    http: {
        port: 8081,
        hostname: 'localhost',
        tls: false,
        autoListen: false,
    },
    openId: {
	secret: process.env.RCT_OPENID_SECRET,
        id: process.env.RCT_OPENID_ID,
        redirect_uri: process.env.RCT_OPENID_REDIRECT,
        well_known: 'https://auth.cern.ch/auth/realms/cern/.well-known/openid-configuration',	    
    },
    winston: {
        file: path.join(__dirname, '..', '..', 'reports/logs.txt'),
    },
    database: {
	hostname: process.env.RCT_DB_HOST,
        dbname: process.env.RCT_DB_NAME,
        dbuser: process.env.RCT_DB_USERNAME,
        password: process.env.RCT_DB_PASSWORD,
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

                mcRawData: 'https://alimonitor.cern.ch/MC/?res_path=json',
                // eslint-disable-next-line max-len
                mcRawDataDetailed: 'https://alimonitor.cern.ch/job_events.jsp?timesel=0&owner=aliprod&filter_jobtype=Pb-Pb%2C+5.02+TeV+-+HIJING+%2B+nuclei+Geant4+with+modified+material+budget+%2B4.5%+(Pb-Pb+Pass3)%2C+50-90%+centrality%2C+ALIROOT-8784&res_path=json',
            },
        },
    },

    public: require('./public.js'),
};

// TODO config validation
