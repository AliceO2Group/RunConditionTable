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

const util = require('util');
const http = require('http');
const https = require('https');

const exec = util.promisify(require('child_process').exec);

const keywords = ['DEFAULT', 'NULL'];
class Utils {
    static async exec(cmd) {
        if (Array.isArray(cmd)) {
            cmd = cmd.join(' ');
        }
        return await exec(cmd);
    }

    static reversePrimitiveObject(obj) {
        return Object.fromEntries(Object.entries(obj).map((e) => e.reverse()));
    }

    static filterObject(obj, keptFields, suppressUndefined = false) {
        if (!keptFields) {
            return obj;
        }
        const res = {};
        for (const [nr, nl] of Object.entries(keptFields)) {
            if (!suppressUndefined || res[nl]) {
                res[nl] = obj[nr];
            }
        }
        return res;
    }

    static adjusetObjValuesToSql(obj) {
        const res = {};
        for (const k in obj) {
            if (obj[k]) {
                if (typeof obj[k] == 'object') {
                    if (Array.isArray(obj[k])) {
                        res[k] = `ARRAY[${obj[k].map((d) => Utils.parseValueToSql(d)).join(',')}]`;
                    } else {
                        res[k] = Utils.adjusetObjValuesToSql(obj[k]);
                    }
                } else {
                    res[k] = Utils.parseValueToSql(obj[k]);
                }
            } else {
                res[k] = null;
            }
        }
        return res;
    }

    static parseValueToSql(v) {
        if (!v) {
            return null;
        }
        if (typeof v == 'string' && !keywords.includes(v.toUpperCase())) {
            if (v.length == 0) {
                return null;
            } else {
                return `'${v}'`;
            }
        } else {
            return v;
        }
    }

    static parseValuesToSql(values) {
        return values.map((v) => Utils.parseValueToSql(v));
    }

    static preserveSQLKeywords(words) {
        return words.map((w) => {
            if (['end'].includes(w)) {
                return `"${w}"`;
            } else {
                return w;
            }
        });
    }

    static simpleBuildInsertQuery(targetTable, valuesObj) {
        return `INSERT INTO ${targetTable}(${Utils.preserveSQLKeywords(Object.keys(valuesObj)).join(', ')})
                VALUES(${Utils.parseValuesToSql(Object.values(valuesObj)).join(', ')})`;
    }

    static switchCase(caseName, cases, defaultCaseValue) {
        return Object.prototype.hasOwnProperty.call(cases, caseName)
            ? cases[caseName]
            : defaultCaseValue;
    }

    static delay(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    static replaceAll(s, pattern, replace) {
        const p = s.split(pattern);
        return p.join(replace);
    }

    static arrayToChunks(arr, chunkSize) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    }

    static extractPeriodYear(name) {
        try {
            let year = parseInt(name.slice(3, 5), 10);
            if (year > 50) {
                year += 1900;
            } else {
                year += 2000;
            }
            return year;
        } catch (e) {
            return 'NULL';
        }
    }

    static applyOptsToObj(obj, options) {
        Object.entries(options).forEach(([k, v]) => {
            obj[k] = v;
        });
    }

    static nullIfThrows(func, args, errorHandler) {
        try {
            return func(...args);
        } catch (e) {
            if (errorHandler) {
                errorHandler(e, args);
            }
            return null;
        }
    }

    static distinct(arr) {
        return arr.filter((value, index, self) => self.indexOf(value) === index);
    }

    static checkClientType(endpoint) {
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

    static makeHttpRequest(endpoint, opts, logger, onSuccess, onFialure) {
        return new Promise((resolve, reject) => {
            let rawData = '';
            const req = Utils.checkClientType(endpoint).request(endpoint, opts, async (res) => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;
                let redirect = false;
                if (statusCode == 302 || statusCode == 301) {
                    const mess = `Redirect. Status Code: ${statusCode}; red. to ${res.headers.location}`;
                    if (opts.allowRedirects) {
                        redirect = true;
                        logger.warn(mess);
                        const nextHope = new URL(endpoint.origin + res.headers.location);
                        nextHope.searchParams.set('res_path', 'json');
                        logger.warn(`from ${endpoint.href} to ${nextHope.href}`);
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
                    logger.error(error.message);
                    res.resume();
                    return;
                }

                res.on('data', (chunk) => {
                    rawData += chunk;
                });

                req.on('error', (e) => {
                    this.logger.error(`ERROR httpGet: ${e}`);
                    if (onFialure) {
                        onFialure(endpoint, e);
                    }
                    reject(e);
                });

                res.on('end', () => {
                    try {
                        if (!redirect) {
                            const data = JSON.parse(rawData);
                            if (onSuccess) {
                                onSuccess(endpoint, data);
                            }
                            resolve(data);
                        }
                    } catch (e) {
                        this.logger.error(e.message);
                        if (onFialure) {
                            onFialure(endpoint, e);
                        }
                        reject(e);
                    }
                });
            });

            req.end();
        });
    }
}

module.exports = Utils;
