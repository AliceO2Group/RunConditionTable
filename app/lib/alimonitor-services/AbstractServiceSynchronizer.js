/**
 *
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const { Client } = require('pg');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { Log } = require('@aliceo2/web-ui');
const config = require('../config/configProvider.js');
const ResProvider = require('../ResProvider.js');
const Utils = require('../Utils.js');
const Cacher = require('./Cacher.js');

const defaultServiceSynchronizerOptions = {
    forceStop: false,

    rawCacheUse: true,
    useCacheJsonInsteadIfPresent: false,
    omitWhenCached: false,

    batchedRequestes: true,
    batchSize: 4,
};

const additionalHttpOpts = {
    allowRedirects: true, // TODO
};

class PassCorrectnessMonitor {
    constructor(logger, errorsLoggingDepth) {
        this.logger = logger;
        this.errorsLoggingDepth = errorsLoggingDepth;
        this.correct = 0;
        this.incorrect = 0;
        this.errors = [];
    }

    handleCorrect() {
        this.correct++;
    }

    handleIncorrect(e, data) {
        this.incorrect++;
        e.data = data;
        this.errors.push(e);
    }

    logResults() {
        const { correct, incorrect, errors, errorsLoggingDepth, logger } = this;
        const dataSize = incorrect + correct;

        if (incorrect > 0) {
            const logFunc = Utils.switchCase(errorsLoggingDepth, config.errorsLoggingDepths);
            errors.forEach((e) => logFunc(logger, e));
            logger.warn(`sync unseccessful for ${incorrect}/${dataSize}`);
        }
        if (correct > 0) {
            logger.info(`sync successful for  ${correct}/${dataSize}`);
        }
    }
}

class AbstractServiceSynchronizer {
    constructor() {
        this.name = this.constructor.name;
        this.logger = new Log(this.name);

        this.opts = this.createHttpOpts();

        this.metaStore = {};
        this.errorsLoggingDepth = config.defaultErrorsLogginDepth;
        Utils.applyOptsToObj(this, defaultServiceSynchronizerOptions);
        Utils.applyOptsToObj(this.opts, additionalHttpOpts);
    }

    createHttpOpts() {
        let opts = this.getHttpOptsBasic();
        opts = this.setSLLForHttpOpts(opts);
        opts = this.setHttpSocket(opts);
        return opts;
    }

    getHttpOptsBasic() {
        return {
            rejectUnauthorized: false,
            headers: {
                Accept:	'application/json;charset=utf-8',
                'Accept-Language':	'en-US,en;q=0.5',
                Connection:	'keep-alive',
                'User-Agent': 'Mozilla/5.0',
            },
        };
    }

    setSLLForHttpOpts(opts) {
        const pfxWrp = ResProvider.securityFilesContentProvider(
            ['rct-alimonitor-cert.p12'],
            'pfx - pkcs12 cert',
            'RCT_CERT_PATH',
            true,
        );

        const { logsStacker } = pfxWrp;
        logsStacker.typeLog('info');
        if (!pfxWrp.content) {
            if (logsStacker.any('error')) {
                logsStacker.typeLog('warn');
                logsStacker.typeLog('error');
            }
        }
        const passphrase = ResProvider.passphraseProvider();

        opts.pfx = pfxWrp.content;
        opts.passphrase = passphrase;

        return opts;
    }

    setHttpSocket(opts) {
        const proxy = ResProvider.socksProvider();
        if (proxy?.length > 0) {
            this.logger.info(`using proxy/socks '${proxy}' to CERN network`);
            opts.agent = new SocksProxyAgent(proxy);
        } else {
            this.logger.info('service do not use proxy/socks to reach CERN network');
        }
        return opts;
    }

    setLogginLevel(logginLevel) {
        Utils.throwNotImplemented();
        logginLevel = parseInt(logginLevel, 10);
        if (!logginLevel || logginLevel < 0 || logginLevel > 3) {
            throw new Error('Invalid debug level') ;
        }
        this.loglev = logginLevel;
    }

    /**
     * Combine logic of fetching data from service
     * like bookkeeping and processing
     * and inserting to local database
     * @param {URL} endpoint endpoint to fetch data
     * @param {CallableFunction} responsePreprocess used to preprocess response to objects list
     * @param {CallableFunction} dataAdjuster logic for processing data
     * before inserting to database (also adjusting data to sql foramt) - should returns null if error occured
     * @param {CallableFunction} filterer filter rows
     * @param {CallableFunction} dbAction logic for inserting data to database
     * @param {CallableFunction} metaDataHandler used to handle logic of hanling data
     * like total pages to see etc., on the whole might be used to any custom logic
     * @returns {*} void
     */
    async syncPerEndpoint(
        endpoint,
        responsePreprocess,
        dataAdjuster,
        filterer,
        dbAction,
        metaDataHandler = null,
    ) {
        if (this.omitWhenCached && Cacher.isCached(this.name, endpoint)) {
            this.logger.info(`omitting cached json at :: ${Cacher.cachedFilePath(this.name, endpoint)}`);
            return;
        }
        try {
            this.dbAction = dbAction; //TODO
            this.monitor = new PassCorrectnessMonitor(this.logger, this.errorsLoggingDepth);

            const rawResponse = await this.getRawResponse(endpoint);
            if (metaDataHandler) {
                metaDataHandler(rawResponse);
            }
            const data = responsePreprocess(rawResponse)
                .map((r) => dataAdjuster(r))
                .filter((r) => r && filterer(r));

            if (this.batchedRequestes) {
                this.makeBatchedRequest(data);
            } else {
                this.makeSequentialRequest(data);
            }
            this.monitor.logResults();
        } catch (fatalError) {
            this.logger.error(fatalError.stack);
            if (/ECONREFUSED|ENOTFOUND|ECONNRESET|ETIMEDOUT|ECONNABORTED|EHOSTUNREACH|EAI_AGAIN/.test(fatalError.name + fatalError.message)) {
                this.forceStop = true;
                this.logger.error(`terminated due to fatal error ${fatalError.name}`);
            }
        }
    }

    async makeBatchedRequest(data) {
        const rowsChunks = Utils.arrayToChunks(data, this.batchSize);
        for (const chunk of rowsChunks) {
            const promises = chunk.map((dataUnit) => this.dbAction(this.dbclient, dataUnit)
                .then(() => this.monitor.handleCorrect())
                .catch((e) => this.monitor.handleIncorrect(e, { dataUnit: dataUnit })));

            await Promise.all(promises);
        }
    }

    async makeSequentialRequest(data) {
        for (const dataUnit of data) {
            await this.dbAction(this.dbclient, dataUnit)
                .then(this.monitor.handleCorrect)
                .catch((e) => this.monitor.handleIncorrect(e, { dataUnit: dataUnit }));
        }
    }

    async getRawResponse(endpoint) {
        if (this.useCacheJsonInsteadIfPresent && Cacher.isCached(this.name, endpoint)) {
            this.logger.info(`using cached json :: ${Cacher.cachedFilePath(this.name, endpoint)}`);
            return Cacher.getJsonSync(this.name, endpoint);
        }
        const onSucces = (endpoint, data) => {
            if (this.rawCacheUse) {
                Cacher.cache(this.name, endpoint, data);
            }
        };
        return await Utils.makeHttpRequestForJSON(endpoint, this.opts, this.logger, onSucces);
    }

    async dbConnect() {
        this.dbclient = new Client(config.database);
        this.dbclient.on('error', (e) => this.logger.error(e));

        return await this.dbclient.connect()
            .then(() => this.logger.info('database connection established'));
    }

    async dbDisconnect() {
        return await this.dbclient.end()
            .then(() => this.logger.info('database connection ended'));
    }

    async setSyncTask() {
        this.forceStop = false;
        await this.sync()
            .catch((e) => {
                this.logger.error(e.stack);
            });
    }

    async close() {
        this.forecStop = true;
        await this.dbDisconnect();
    }

    isConnected() {
        return this.dbClient._connected;
    }

    async restart() {
        this.opts = this.createHttpOpts();
        await this.close();
        await this.dbConnect();
    }
}

module.exports = AbstractServiceSynchronizer;
