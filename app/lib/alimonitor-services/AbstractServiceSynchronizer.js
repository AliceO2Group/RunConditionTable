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
const { ResProvider, makeHttpRequestForJSON, arrayToChunks, applyOptsToObj, throwNotImplemented } = require('../utils');
const { Cacher, PassCorrectnessMonitor, ProgressMonitor } = require('./helpers');

const defaultServiceSynchronizerOptions = {
    forceStop: false,
    rawCacheUse: process.env['RCT_DEV_USE_CACHE'] === 'false' ? false : true,
    useCacheJsonInsteadIfPresent: process.env['RCT_DEV_USE_CACHE_INSTEAD'] === 'true' ? true : false,
    omitWhenCached: process.env['RCT_DEV_OMIT_WHEN_CACHED'] === 'true' ? true : false,
    batchSize: 4,
};

class AbstractServiceSynchronizer {
    constructor() {
        this.name = this.constructor.name;
        this.logger = new Log(this.name);

        this.opts = this.createHttpOpts();

        this.metaStore = {};

        this.errorsLoggingDepth = config.defaultErrorsLogginDepth;
        applyOptsToObj(this, defaultServiceSynchronizerOptions);
        applyOptsToObj(this.opts, {
            allowRedirects: true,
        });
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
        logsStacker.logType('info');
        if (!pfxWrp.content) {
            if (logsStacker.any('error')) {
                logsStacker.logType('warn');
                logsStacker.logType('error');
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
        throwNotImplemented();
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
            await this.dbConnect();

            this.dbAction = dbAction; //TODO
            this.monitor = new PassCorrectnessMonitor(this.logger, this.errorsLoggingDepth);

            const rawResponse = await this.getRawResponse(endpoint);
            if (metaDataHandler) {
                metaDataHandler(rawResponse);
            }
            const data = responsePreprocess(rawResponse)
                .map((r) => dataAdjuster(r))
                .filter((r) => {
                    const f = r && filterer(r);
                    if (!f) {
                        this.monitor.handleOmitted();
                    }
                    return f;
                });

            await this.makeBatchedRequest(data);

            this.monitor.logResults();
        } catch (fatalError) {
            this.logger.error(fatalError);
            await this.interrtuptSyncTask();
        }
    }

    async makeBatchedRequest(data) {
        const rowsChunks = arrayToChunks(data, this.batchSize);
        const total = this.metaStore.totalCount || data.length;
        this.progressMonitor.setTotal(total);
        for (const chunk of rowsChunks) {
            if (this.forceStop) {
                return;
            }
            const promises = chunk.map((dataUnit) => this.dbAction(this.dbClient, dataUnit)
                .then(() => this.monitor.handleCorrect())
                .catch((e) => this.monitor.handleIncorrect(e, { dataUnit: dataUnit })));

            await Promise.all(promises);
            this.progressMonitor.update(chunk.length);
            this.progressMonitor.tryLog();
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
        return await makeHttpRequestForJSON(endpoint, this.opts, this.logger, onSucces);
    }

    async setSyncTask(options) {
        this.progressMonitor = new ProgressMonitor({ logger: this.logger.info.bind(this.logger), percentageStep: 0.25 });
        this.forceStop = false;
        await this.sync(options)
            .then(() => {
                if (this.forceStop) {
                    this.logger.info(`${this.name} forced to stop`);
                }
            });
    }

    /**
     * Interrupt sync task, so dbAction or syncPerEndpoint methods,
     * which is subsequent towards one being executed, will not be called.
     * It will NOT interrupt any sequelize call being executed.
     * @return {void}
     */
    async interrtuptSyncTask() {
        this.forceStop = true;
    }
}

module.exports = AbstractServiceSynchronizer;
