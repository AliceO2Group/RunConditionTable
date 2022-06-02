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
                mcRawData: 'https://alimonitor.cern.ch/MC/?res_path=json',
                // eslint-disable-next-line max-len
                mcRawDataDetailed: 'https://alimonitor.cern.ch/job_events.jsp?timesel=0&owner=aliprod&filter_jobtype=Pb-Pb%2C+5.02+TeV+-+HIJING+%2B+nuclei+Geant4+with+modified+material+budget+%2B4.5%+(Pb-Pb+Pass3)%2C+50-90%+centrality%2C+ALIROOT-8784&res_path=json',
            },
        },
    },

    public: require('./public.js'),
};

// TODO config validation
