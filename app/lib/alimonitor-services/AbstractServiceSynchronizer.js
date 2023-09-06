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

const { SocksProxyAgent } = require('socks-proxy-agent');
const { Log } = require('@aliceo2/web-ui');
const config = require('../config/configProvider.js');
const { ResProvider, makeHttpRequestForJSON, arrayToChunks, applyOptsToObj, throwNotImplemented } = require('../utils');
const { Cacher, PassCorrectnessMonitor, ProgressMonitor } = require('./helpers');

const defaultServiceSynchronizerOptions = {
    forceStop: false,
    cacheRawResponse: process.env['RCT_DEV_USE_CACHE'] === 'false' ? false : true,
    useCacheJsonInsteadIfPresent: process.env['RCT_DEV_USE_CACHE_INSTEAD'] === 'true' ? true : false,
    batchSize: 4,
};

/**
 * AbstractServiceSynchronizer
 * The class provides schema for excecuting process of data synchronization with external service (fetching from it)
 * Its behaviour can be customized with overriding abstract methods
 */
class AbstractServiceSynchronizer {
    constructor() {
        this.name = this.constructor.name;
        this.logger = new Log(this.name);

        this.opts = this.createHttpOpts();

        this.metaStore = { perUrl: {} };

        this.errorsLoggingDepth = config.defaultErrorsLogginDepth;
        applyOptsToObj(this, defaultServiceSynchronizerOptions);
        applyOptsToObj(this.opts, {
            allowRedirects: true,
        });
    }

    createHttpOpts() {
        let opts = this.getHttpOptsBasic();
        opts = this.setSLLForHttpOpts(opts);
        opts = this.setHttpSocksProxy(opts);
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

    setHttpSocksProxy(opts) {
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
     * Combine logic of fetching data from service like bookkeeping, processing and inserting to database
     * @param {URL} endpoint endpoint to fetch data from
     * @param {CallableFunction} metaDataHandler used if synchronization requires handling some meta data.
     * like total pages to see etc., on the whole might be used to any custom logic
     * Besides given arguemnts the method depends on three abstract methods to be overriden
     * @see AbstractServiceSynchronizer.processRawResponse
     * @see AbstractServiceSynchronizer.isDataUnitValid
     * @see AbstractServiceSynchronizer.executeDbAction
     *
     * @returns {boolean} - true if process was finalized without major errors and with/without minor errors, otherwise false,
     * Major errors are understood as ones indicating that further synchronization is purposeless: e.g. due to networ error, invalid certificate.
     * Minor errors are understood as e.g. managable ambiguities in data.
     */
    async syncPerEndpoint(
        endpoint,
        metaDataHandler = null,
    ) {
        this.monitor = new PassCorrectnessMonitor(this.logger, this.errorsLoggingDepth);
        return await this.getRawResponse(endpoint)
            .then(async (rawResponse) => {
                if (metaDataHandler) {
                    await metaDataHandler(rawResponse);
                }
                return rawResponse;
            })
            .then(async (rawResponse) => this.processRawResponse(rawResponse)
                .filter((r) => {
                    const f = r && this.isDataUnitValid(r);
                    if (!f) {
                        this.monitor.handleOmitted();
                    }
                    return f;
                }))
            .then(async (data) => await this.makeBatchedRequest(data, endpoint))
            .then(() => {
                this.monitor.logResults();
                return true; // Passed without major errors
            })
            .catch(async (fatalError) => {
                this.logger.error(`${fatalError.message} :: ${fatalError.stack}`);
                this.interrtuptSyncTask();
                return false; // Major error occurred
            });
    }

    async makeBatchedRequest(data, endpoint) {
        const rowsChunks = arrayToChunks(data, this.batchSize);
        const total = this.metaStore.totalCount || data.length;
        this.progressMonitor.setTotal(total);
        for (const chunk of rowsChunks) {
            if (this.forceStop) {
                return;
            }
            const promises = chunk.map((dataUnit) => this.executeDbAction(dataUnit, this.metaStore.perUrl[endpoint])
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
            if (this.cacheRawResponse) {
                Cacher.cache(this.name, endpoint, data);
            }
        };
        return await makeHttpRequestForJSON(endpoint, this.opts, this.logger, onSucces);
    }

    /**
     * Start process of synchroniztion with particular external system,
     * it depends on custom configuration of class inheriting from this class
     * @param {Object} options - customize sync procedure,
     * e.g. some custom class may required some context to start process, e.g. some data unit,
     * @return {boolean} - true if process was finalized without major errors and with/without minor errors, otherwise false,
     * Major errors are understood as ones indicating that further synchronization is purposeless: e.g. due to networ error, invalid certificate.
     * Minor errors are understood as e.g. managable ambiguities in data.
     */
    async setSyncTask(options) {
        this.progressMonitor = new ProgressMonitor({ logger: this.logger.info.bind(this.logger), percentageStep: 0.25 });
        this.forceStop = false;
        return await this.sync(options)
            .catch((fatalError) => {
                this.logger.error(`${fatalError.message} :: ${fatalError.stack}`);
                return false;
            });
    }

    /**
     * Interrupt sync task, so dbAction or syncPerEndpoint methods,
     * which is subsequent towards one being executed, will not be called.
     * It will NOT interrupt any sequelize call being executed.
     * @return {void}
     */
    interrtuptSyncTask() {
        this.forceStop = true;
    }

    isStopped() {
        return this.forceStop;
    }

    /**
     * ProcessRawResponse - used to preprocess response to custom format
     * @abstractMethod
     * @param {*} _rawResponse - raw data acquired from external service
     * @return {*} adjusted data
     */
    async processRawResponse(_rawResponse) {
        throwNotImplemented();
    }

    /**
     * Check if data unit is valid; should be filterd out or not, may handle reason for rejecting some data unit
     * @abstractMethod
     * @param {*} _dataUnit - data portion to be filterd out or left in set of valid data
     * @return {boolean} - true if dataUnit is valid
     */
    async isDataUnitValid(_dataUnit) {
        throwNotImplemented();
    }

    /**
     * Implements logic for inserting/updating database data
     * @abstractMethod
     * @param {*} _dataUnit - data unit some db action is to be performed on
     * @param {*|undefined} _options - some meta data, e.g. some context required execute db action
     * @return {void}
     */
    async executeDbAction(_dataUnit, _options) {
        throwNotImplemented();
    }
}

module.exports = AbstractServiceSynchronizer;
