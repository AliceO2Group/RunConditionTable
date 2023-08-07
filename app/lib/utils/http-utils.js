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

const http = require('http');
const https = require('https');
const { Log } = require('@aliceo2/web-ui');
const path = require('path');
const fs = require('fs');

const logger = new Log('Utils');

function checkClientType(endpoint) {
    const unspecifiedProtocolMessage = 'unspecified protocol in url';

    switch (endpoint.protocol) {
        case 'http:':
            return http;
        case 'https:':
            return https;
        default:
            logger.error(unspecifiedProtocolMessage);
            throw new Error(unspecifiedProtocolMessage);
    }
}

function makeHttpRequestForJSON(endpoint, opts, logger, onSuccess, onFailure) {
    endpoint = new URL(endpoint);
    return new Promise((resolve, reject) => {
        let rawData = '';
        const req = checkClientType(endpoint).request(endpoint, opts, async (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let error;
            let redirect = false;
            if (statusCode == 302 || statusCode == 301) {
                const mess = `Redirect. Status Code: ${statusCode}; red. to ${res.headers.location}`;
                if (opts.allowRedirects) {
                    redirect = true;
                    logger.warn(mess);
                    const nextHop = new URL(endpoint.origin + res.headers.location);
                    nextHop.searchParams.set('res_path', 'json');
                    logger.warn(`from ${endpoint.href} to ${nextHop.href}`);
                    resolve(await makeHttpRequestForJSON(nextHop));
                } else {
                    throw new Error(mess);
                }
            } else if (statusCode !== 200) {
                error = new Error(`Request Failed. Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error(`Invalid content-type. Expected application/json but received ${contentType}`);
            }
            if (error) {
                logger.error(error.message);
                res.resume();
                return;
            }

            res.on('data', (chunk) => {
                rawData += chunk;
            });

            req.on('error', (e) => {
                logger.error(`ERROR httpGet: ${e}`);
                if (onFailure) {
                    onFailure(endpoint, e);
                }
                reject(e);
            });

            res.on('end', () => {
                try {
                    if (!redirect) {
                        /*
                         * TMP incorrect format handling
                         * if (/: *,/.test(rawData)) {
                         *     rawData = rawData.replaceAll(/: *,/ig, ':"",');
                         * }
                         */

                        const data = JSON.parse(rawData);
                        if (onSuccess) {
                            onSuccess(endpoint, data);
                        }
                        resolve(data);
                    }
                } catch (e) {
                    logger.error(`${e.message} for endpoint: ${endpoint.href}`);
                    const fp = path.join(
                        __dirname,
                        '..',
                        '..',
                        '..',
                        'database',
                        'cache',
                        'rawJson',
                        'failing-endpoints.txt',
                    );
                    fs.appendFileSync(fp, `${endpoint.href}\n     ${e.message}\n`);
                    if (onFailure) {
                        onFailure(endpoint, e);
                    }
                    reject(e);
                }
            });
        });

        req.end();
    });
}

module.exports = {
    checkClientType,
    makeHttpRequestForJSON,
};
