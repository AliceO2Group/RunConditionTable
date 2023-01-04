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
    useCacheJsonInsteadIfPresent: true,
    omitWhenCached: false,

    batchedRequestes: true,
    batchSize: 5,

    allowRedirects: true, // TODO
};

class PassCorrectnessMonitor {
    constructor(logger, loglev) {
        this.logger = logger;
        this.loglev = loglev;
        this.correct = 0;
        this.incorrect = 0;
        this.errors = [];
    }

    correct() {
        this.correct ++;
    }

    incorrect(e, data) {
        this.incorrect ++;
        e.data = data;
        this.errors.push(e);
    }

    logResults() {
        const { correct, incorrect, errors, loglev, logger } = this;
        const dataSize = incorrect + correct;

        if (incorrect > 0) {
            if (loglev > 3) {
                errors.forEach((e) => logger.error(JSON.stringify(e, null, 2)));
            } else if (loglev > 2) {
                errors.forEach((e) => logger.error(e.stack));
            } else if (loglev > 1) {
                errors.forEach((e) => logger.error(e.message));
            }
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
        this.loglev = config.defaultLoglev; // TODO
        Utils.applyOptsToObj(this, defaultServiceSynchronizerOptions);
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
            ['myCertificate.p12'],
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
            this.monitor = new PassCorrectnessMonitor(this.logger, this.loglev);

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
            if ((fatalError.name + fatalError.message).includes('ECONNREFUSED')) {
                this.forceStop = true;
                this.logger.warn('terminated due to fatal error (ECONNREFUSED)');
            }
        }
    }

    async makeBatchedRequest(data) {
        const rowsChunks = Utils.arrayToChunks(data, this.batchSize);
        for (const chunk of rowsChunks) {
            const promises = chunk.map((dataUnit) => this.dbAction(this.dbclient, dataUnit)
                .then(this.monitor.correct)
                .catch((e) => this.monitor.incorrect(e, { dataUnit: dataUnit })));

            await Promise.all(promises);
        }
    }

    async makeSequentialRequest(data) {
        for (const dataUnit of data) {
            await this.dbAction(this.dbclient, dataUnit)
                .then(this.monitor.correct)
                .catch((e) => this.monitor.incorrect(e, { dataUnit: dataUnit }));
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

    async restart() {
        this.opts = this.createHttpOpts();
        await this.close();
        await this.dbConnect();
    }
}

module.exports = AbstractServiceSynchronizer;
