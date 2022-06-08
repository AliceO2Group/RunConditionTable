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

class ServicesSynchronizer {
    constructor() {
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
                Accept:	'application/json',
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
    }

    /**
     * Combine logic of fetching data from service
     * like bookkeeping and processing
     * and inserting to local database
     * @param {string} endpoint endpoint to fetch data
     * @param {CallableFunction} dataAdjuster logic for processing data before inserting to database
     * @param {CallableFunction} syncer logic for insert ing data to database
     * @param {CallableFunction} responsePreprocess used to preprocess response to objects list
     * @param {CallableFunction} metaDataHandler used to handle logic of hanling data
     * like total pages to see etc., on the whole might be used to any custom logic
     * @returns {Promise} batched promieses for each syncer invokation
     * all parameters should be defined in derived classes
     */
    async syncData(endpoint, dataAdjuster, syncer, responsePreprocess, metaDataHandler = null) {
        try {
            const result = await this.getRawData(endpoint);
            if (metaDataHandler) {
                metaDataHandler(result);
            }
            const rows = responsePreprocess(result)
                .map((r) => dataAdjuster(r));

            let i = 0;
            const dataSize = rows.length;
            const promises = rows.map((r) => syncer(this.dbclient, r)
                .then(() => {
                    i++;
                    // this.logger.info(`sync procedure per data protion done:: ${i}/${dataSize}`);
                })
                .catch((e) => {
                    i++;
                    // this.logger.error(`'${e.message}' per data portion ${i}/${dataSize}`);
                }));

            await Promise.all(promises);
        } catch (error) {
            this.logger.error(error);
        }
    }

    async getRawData(endpoint) {
        return new Promise((resolve, reject) => {
            let rawData = '';
            const req = this.checkClientType(endpoint).request(endpoint, this.opts, (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error(`Request Failed. Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error(`Invalid content-type. Expected application/json but received ${contentType}`);
                }
                if (error) {
                    this.logger.error(error);
                    res.resume();
                    return;
                }

                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    const data = JSON.parse(rawData);
                    resolve(data);
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
        switch (this.opts.protocol || `${endpoint.split(':')[0]}:`) {
            case 'http:':
                return http;
            case 'https:':
                return https;
            default:
                // eslint-disable-next-line no-case-declarations
                const mess = 'unspecified protocol in url';
                this.logger.error(mess);
                throw new Error(mess);
        }
    }
}

module.exports = ServicesSynchronizer;
