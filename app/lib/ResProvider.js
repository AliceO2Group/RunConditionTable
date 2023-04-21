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
const { Log } = require('@aliceo2/web-ui');
const path = require('path');
const LogsStacker = require('./LogsStacker.js');
const Utils = require('./Utils.js');

// eslint-disable-next-line prefer-const
let logger;

const resProviderDefaults = {
    defaultSecuredDirPath: path.join(__dirname, '..', '..', 'security'),
};

class ResProvider {
    /**
     * Function to get collection of desired env vars into js object fulfiling some requiremnts
     * and executing action after requiremnts checking failure
     * @param {Object} objDefinition define mapping of env vars names to local nodejs process names
     * @param {CallableFunction} failurePredicate func(res, objDefinition) that get res - object with read env vars values and objDefinition
     * and examine if combination of read env vars fulfil some requirements - default check if all fildes are set
     * @param {CallableFunction|String} onFailureAction action on failure - defualt throw error with message about unset fileds
     * can be string: warn just log warning, error: log error and throw error,
     * @returns {Object} desired env vars stored in object under names defined by mapping
     */
    static viaEnvVars(objDefinition, failurePredicate, onFailureAction) {
        const res = {};
        for (const [envVName, key] of Object.entries(objDefinition)) {
            res[key] = process.env[envVName];
        }
        if (!failurePredicate && !ResProvider.areDesiredValuesPresent(res, objDefinition)
            || failurePredicate && failurePredicate(res, objDefinition)) {
            if (!onFailureAction) {
                ResProvider.onFailureAction_error(res, objDefinition);
            } else if (typeof onFailureAction == 'function') {
                return onFailureAction(res, objDefinition);
            } else if (typeof onFailureAction == 'string') {
                return Utils.switchCase(onFailureAction, {
                    error: ResProvider.onFailureAction_error,
                    warn: ResProvider.onFailureAction_warn,
                    no: () => res,
                })(res, objDefinition);
            }
        }
        return res;
    }

    static areDesiredValuesPresent(obj, objDefinition) {
        for (const key of Object.values(objDefinition)) {
            if (!obj[key]) {
                return false;
            }
        }
        return true;
    }

    static nulledGetter(res, objDef) {
        return Object.entries(res).filter((e) => ! e[1]).map((e) => `${e[0]}{<-${Utils.reversePrimitiveObject(objDef)[e[0]]}}`);
    }

    static nulledMessageGetter(res, objDef) {
        return `unset fields from envvars: ' + ${ResProvider.nulledGetter(res, objDef).join(', ')}`;
    }

    static onFailureAction_error(res, objDef) {
        const mess = ResProvider.nulledMessageGetter(res, objDef);
        logger.error(mess);
        throw mess;
    }

    static onFailureAction_warn(res, objDef) {
        const mess = ResProvider.nulledMessageGetter(res, objDef);
        logger.warn(mess);
        return res;
    }

    static securityFilesContentProvider(fileNames, description, envVarName, supressLogs = false) {
        const logsStacker = new LogsStacker(ResProvider.name);
        const file_path = process.env[envVarName];
        let secContent;
        try {
            secContent = fs.readFileSync(file_path);
            logsStacker.substitute('info', `${description}: loaded from file ${file_path}`);
        } catch (err) {
            logsStacker.put('warn', `cannot load file at ${envVarName} ${err}`);
        }

        if (!secContent) {
            for (const fileName of fileNames) {
                try {
                    const filePath = path.join(
                        resProviderDefaults.defaultSecuredDirPath, fileName,
                    );
                    secContent = fs.readFileSync(filePath);
                    logsStacker.substitute('info', `${description}: loaded from file ${filePath}`);
                    break;
                } catch (e) {
                    logsStacker.put('warn', e.message);
                }
            }
        }
        if (!secContent) {
            logsStacker.put(
                'error',
                `${description}: cannot load file from provided files: [${fileNames.join(',')}] nor from env var ${envVarName}`,
            );
        }

        if (!supressLogs) {
            logsStacker.typeLog('info');
            if (logsStacker.any('error')) {
                logsStacker.typeLog('warn');
                logsStacker.typeLog('error');
            }
        }
        return { content: secContent, logsStacker: logsStacker };
    }

    static socksProvider() {
        const cern_socks_env_var = process.env.CERN_SOCKS;
        logger.info(`CERN_SOCKS set to '${cern_socks_env_var}'`);
        if (process.env.RUNNING_ENV == 'DOCKER' && cern_socks_env_var?.toLowerCase() === 'true') {
            return 'socks://172.200.200.1:12345';
        }
        if (cern_socks_env_var) {
            if (cern_socks_env_var.toLowerCase() == 'false') {
                return null;
            }
            const socks = cern_socks_env_var.trim();
            if (/socks:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+/.test(socks)) {
                return socks;
            } else {
                logger.error(`incorrect format of socks address: ${socks}`);
                return null;
            }
        }
    }

    static http() {
        const httpEnvVarsDef = {
            RCT_HTTP_PORT: 'port',
            RCT_HOSTNAME: 'hostname',
            RCT_TLS_ENABLED: 'tls',
        };

        const http = ResProvider.viaEnvVars(httpEnvVarsDef);
        http.autoListen = false;
        http.tls = http.tls?.toLowerCase() === 'true';
        return http;
    }

    static jwt() {
        const jwtEnvVarsDef = {
            RCT_JWT_SECRET: 'secret',
            RCT_JWT_EXPIRATION: 'expiration',
        };
        return ResProvider.viaEnvVars(jwtEnvVarsDef);
    }

    static openid() {
        const openidEnvVarsDef = {
            RCT_OPENID_SECRET: 'secret',
            RCT_OPENID_ID: 'id',
            RCT_OPENID_REDIRECT: 'redirect_uri',
            RCT_OPENID_WELL_KNOWN: 'well_known',
        };
        return ResProvider.viaEnvVars(openidEnvVarsDef, null, () => null);
    }

    static database() {
        const databaseEnvVarsDef = {
            RCT_DB_HOST: 'host',
            RCT_DB_NAME: 'database',
            RCT_DB_USERNAME: 'user',
            RCT_DB_PASSWORD: 'password',
            RCT_DB_PORT: 'port',
        };
        return ResProvider.viaEnvVars(databaseEnvVarsDef);
    }

    static winston() {
        return { //TODO
            file: ResProvider.viaEnvVars({
                RCT_LOG_FILENAME: 'name',
                RCT_LOG_FILE_LOGLEV: 'level',
            }, null, 'warn'),
            console: ResProvider.viaEnvVars({
                RCT_LOG_CONSOLE_LOGLEV: 'level',
                RCT_LOG_CONSOLE_SYSD: 'systemD',
            }, null, 'warn'),
            infologger: ResProvider.viaEnvVars({
                RCT_INFOLOGGER: 'infologger',
            }, null, 'warn')?.infologger,
        };
    }

    static passphraseProvider() {
        if (process.env.ALIMONITOR_PASSPHRASE) {
            logger.info('using passphrase');
        } else {
            logger.info('no passphrase');
        }
        return process.env.ALIMONITOR_PASSPHRASE;
    }

    static endpointFor(serviceAbbr) {
        // BK-RUNS, ML-DP, ML-MC
        const varsDef = {};
        varsDef[`RCT_EP_${serviceAbbr}_PROT`] = 'prot';
        varsDef[`RCT_EP_${serviceAbbr}_HOST`] = 'host';
        varsDef[`RCT_EP_${serviceAbbr}_PORT`] = 'port';
        varsDef[`RCT_EP_${serviceAbbr}_PATH`] = 'path';
        const p = ResProvider.viaEnvVars(varsDef, null, 'warn');
        const { host } = p;
        let { path } = p;
        // eslint-disable-next-line prefer-destructuring
        let prot = p['prot'];
        prot = prot ? prot : 'https';
        // eslint-disable-next-line prefer-destructuring
        let port = p['port'];
        port = port ? `:${port}` : '';
        path = path ? path.trim().replace(/^\/*/, '') : '';
        return `${prot}://${host}${port}/${path}`;
    }
}

logger = new Log(ResProvider.name);

module.exports = ResProvider;
