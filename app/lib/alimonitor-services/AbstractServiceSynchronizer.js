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
const http = require('http');
const https = require('https');
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

class ServicesSynchronizer {
    constructor() {
        this.name = this.constructor.name;
        this.logger = new Log(this.name);

        this.opts = {
            rejectUnauthorized: false,
            pfx: ResProvider.securityFilesProvider(
                ['myCertificate.p12'],
                'pfx - pkcs12 cert',
                'RCT_CERT_PATH',
            ),
            cert: ResProvider.securityFilesProvider(
                ['cert.pem'],
                'cert.pem',
                'RCT_CERT_PEM_PATH',
            ),
            key: ResProvider.securityFilesProvider(
                ['privkey.pem', 'key.pem'],
                'privkey.pem',
                'RCT_PRIVKEY_PEM_PATH',
            ),
            passphrase: ResProvider.passphraseProvider(),
            headers: {
                Accept:	'application/json;charset=utf-8',
                'Accept-Language':	'en-US,en;q=0.5',
                Connection:	'keep-alive',
                'User-Agent': 'Mozilla/5.0',
            },
        };

        const proxy = ResProvider.socksProvider();
        if (proxy?.length > 0) {
            this.logger.info(`using proxy/socks '${proxy}' to CERN network`);
            this.opts.agent = new SocksProxyAgent(proxy);
        } else {
            this.logger.info('service do not use proxy/socks to reach CERN network');
        }

        this.metaStore = {};
        this.loglev = config.defaultLoglev; // TODO
        Utils.applyOptsToObj(this, defaultServiceSynchronizerOptions);
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
     * @param {CallableFunction} dataAdjuster logic for processing data before inserting to database (also adjusting data to sql foramt)
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
            const { loglev } = this;
            const result = await this.getRawResponse(endpoint);
            if (metaDataHandler) {
                metaDataHandler(result);
            }
            const rows = responsePreprocess(result)
                .map((r) => dataAdjuster(r))
                .filter((r) => filterer(r));

            let correct = 0;
            let incorrect = 0;
            const errors = [];
            const dataSize = rows.length;
            if (this.batchedRequestes) {
                const rowsChunks = Utils.arrayToChunks(rows, this.batchSize);
                for (const chunk of rowsChunks) {
                    const promises = chunk.map((r) => dbAction(this.dbclient, r)
                        .then(() => {
                            correct++;
                        })
                        .catch((e) => {
                            incorrect++;
                            errors.push(e);
                        }));
                    await Promise.all(promises);
                }
            } else {
                for (const r of rows) {
                    await dbAction(this.dbclient, r)
                        .then(() => {
                            correct++;
                        })
                        .catch((e) => {
                            incorrect++;
                            errors.push(e);
                        });
                }
            }

            if (this.loglev > 0) {
                if (correct > 0) {
                    this.logger.info(`sync successful for  ${correct}/${dataSize}`);
                }
                if (incorrect > 0) {
                    this.logger.info(`sync unseccessful for ${incorrect}/${dataSize}`);
                    if (loglev > 2) {
                        errors.forEach((e) => this.logger.error(e.stack));
                    } else if (loglev > 1) {
                        errors.forEach((e) => this.logger.error(e.message));
                    }
                }
            }
        } catch (fatalError) {
            this.logger.error(fatalError.stack);
            if ((fatalError.name + fatalError.message).includes('ECONNREFUSED')) {
                this.forceStop = true;
                this.logger.warn('terminated due to fatal error (ECONNREFUSED)');
            }
        }
    }

    async getRawResponse(endpoint) {
        if (this.useCacheJsonInsteadIfPresent && Cacher.isCached(this.name, endpoint)) {
            this.logger.info(`using cached json :: ${Cacher.cachedFilePath(this.name, endpoint)}`);
            return Cacher.getJsonSync(this.name, endpoint);
        }

        return new Promise((resolve, reject) => {
            let rawData = '';
            const req = this.checkClientType(endpoint).request(endpoint, this.opts, async (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;
                let redirect = false;
                if (statusCode == 302 || statusCode == 301) {
                    const mess = `Redirect. Status Code: ${statusCode}; red. to ${res.headers.location}`;
                    if (this.allowRedirects) {
                        redirect = true;
                        this.logger.warn(mess);
                        const nextHope = new URL(endpoint.origin + res.headers.location);
                        nextHope.searchParams.set('res_path', 'json');
                        this.logger.warn(`from ${endpoint.href} to ${nextHope.href}`);
                        resolve(await this.getRawResponse(nextHope));
                    } else {
                        throw new Error(mess);
                    }
                } else if (statusCode !== 200) {
                    error = new Error(`Request Failed. Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error(`Invalid content-type. Expected application/json but received ${contentType}`);
                }
                if (error) {
                    this.logger.error(error.message);
                    res.resume();
                    return;
                }

                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        if (!redirect) {
                            const data = JSON.parse(rawData);
                            if (this.rawCacheUse) {
                                Cacher.cache(this.name, endpoint, data);
                            }
                            resolve(data);
                        }
                    } catch (e) {
                        this.logger.error(e.message);
                        reject(e);
                    }
                });
            });
            req.on('error', (e) => {
                this.logger.error(`ERROR httpGet: ${e}`);
                reject(e);
            });
            req.end();
        });
    }

    async setupConnection() {
        this.dbclient = new Client(config.database);
        this.dbclient.on('error', (e) => this.logger.error(e));

        return await this.dbclient.connect()
            .then(() => this.logger.info('database connection established'));
    }

    async disconnect() {
        return await this.dbclient.end()
            .then(() => this.logger.info('database connection ended'));
    }

    checkClientType(endpoint) {
        const unspecifiedProtocolMessage = 'unspecified protocol in url';

        switch (endpoint.protocol) {
            case 'http:':
                return http;
            case 'https:':
                return https;
            default:
                this.logger.error(unspecifiedProtocolMessage);
                throw new Error(unspecifiedProtocolMessage);
        }
    }

    async setSyncTask() {
        this.forceStop = false;
        await this.sync();
    }

    async close() {
        this.forecStop = true;
        await this.disconnect();
    }
}

module.exports = ServicesSynchronizer;
