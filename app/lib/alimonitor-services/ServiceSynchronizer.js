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

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const http = require('http');
const https = require('https');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { Log } = require('@aliceo2/web-ui');
const config = require('../config/configProvider.js');
const ResProvider = require('../ResProvider.js');

class ServicesSynchronizer {
    constructor() {
        this.rawCache = true;
        this.allowRedirects = true; // TODO
        this.logger = new Log(ServicesSynchronizer.name);

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
                // 'Accept-Encoding': 'gzip',
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
        this.loglev = config.defaultLoglev;
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
     * @param {string} endpoint endpoint to fetch data
     * @param {CallableFunction} dataAdjuster logic for processing data before inserting to database
     * @param {CallableFunction} syncer logic for inserting data to database
     * @param {CallableFunction} responsePreprocess used to preprocess response to objects list
     * @param {CallableFunction} metaDataHandler used to handle logic of hanling data
     * like total pages to see etc., on the whole might be used to any custom logic
     * @returns {Promise} batched promieses for each syncer invokation
     * all parameters should be defined in derived classes
     */
    async syncData(endpoint, dataAdjuster, syncer, responsePreprocess, metaDataHandler = null) {
        try {
            const { loglev } = this;
            const result = await this.getRawResponse(endpoint);
            if (metaDataHandler) {
                metaDataHandler(result);
            }
            const rows = responsePreprocess(result)
                .map((r) => dataAdjuster(r));

            let correct = 0;
            let incorrect = 0;
            const errors = [];
            const dataSize = rows.length;
            /* eslint-disable */
            // const promises = rows.map((r) => syncer(this.dbclient, r)
            //     .then(() => {
            //         correct++;
            //     })
            //     .catch((e) => {
            //         incorrect++;
            //         errors.push(e);
            //         if (loglev > 1) {
            //             this.logger.error(e.message);
            //         }
            //     }));

            for (const r of rows) {
                await syncer(this.dbclient, r)
                    .then(() => {
                        correct++;
                    })
                    .catch((e) => {
                        incorrect++;
                        errors.push(e);
                        if (loglev > 2) {
                            this.logger.error(e.stack)
                        } else if (loglev > 1) {
                            this.logger.error(e.message);
                        }
                    });
            }

            // await Promise.all(promises);
            if (this.loglev > 0) {
                if (correct > 0) {
                    this.logger.info(`sync successful for  ${correct}/${dataSize}`);
                }
                if (incorrect > 0) {
                    this.logger.error(`sync unseccessful for ${incorrect}/${dataSize}`);
                }
            }
        } catch (error) {
            this.logger.error(error.stack);
            if ((error.name + error.message).includes('ECONNREFUSED')) {
                this.forceStop = true;
                this.logger.warn('terminated due to fatal error');
            }
        }
    }

    async getRawResponse(endpoint) {
        const className = this.constructor.name;
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
                        this.logger.warn('from {} to {}', endpoint.href, nextHope.href);
                        const r = await this.getRawResponse(nextHope)
                        resolve(r)
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
                            if (this.rawCache) {
                                const cacheDir = path.join(__dirname, '..', '..', '..', 'database', 'cache', className);
                                if (!fs.existsSync(cacheDir)) {
                                    fs.mkdirSync(cacheDir, { recursive: true });
                                }
                                fs.writeFileSync(path.join(cacheDir, endpoint.searchParams.toString()), JSON.stringify(data, null, 2));
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

    clearSyncTask() {
        this.forceStop = true;
        if (this.tasks) {
            for (const task of this.tasks) {
                clearInterval(task);
            }
        }
    }
}

module.exports = ServicesSynchronizer;
