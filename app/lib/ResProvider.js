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

class ResProvider {
    static viaEnvVars(objDefinition, failurePredicate, onFailureAction) {
        const reversedObjDefintion = Utils.reversePrimitiveObject(objDefinition);
        const res = {};
        for (const [envVName, key] of Object.entries(objDefinition)) {
            res[key] = process.env[envVName];
        }
        if (!failurePredicate && !ResProvider.areDesiredValuesPresent(res, objDefinition)
            || failurePredicate && failurePredicate(res, objDefinition)) {
            const nulledFields = Object.entries(res).filter((e) => ! e[1]).map((e) => `${e[0]}{<-${reversedObjDefintion[e[0]]}}`);
            const mess = `unset fields: ' + ${nulledFields.join(', ')}`;
            logger.error(mess);
            return (onFailureAction ?
                (res, objDefinition) => onFailureAction(res, objDefinition) :
                () => {
                    throw mess;
                })(res, objDefinition);
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

    // TODO generalize this methods ::( single content provider method)
    static securityFilesProvider(fileNames, description, envVarName = '_') {
        const logsStacker = new LogsStacker(ResProvider.name);
        const file_path = process.env[envVarName];
        let securityContent;
        try {
            securityContent = fs.readFileSync(file_path);
            logsStacker.substitute('info', `${description}: loaded from file`);
        } catch (err) {
            logsStacker.put('warn', `cannot load file at ${envVarName} ${err}`);
        }

        if (!securityContent) {
            for (const fileName of fileNames) {
                try {
                    const filePath = path.join(
                        __dirname, '..', '..', 'security', fileName,
                    );
                    securityContent = fs.readFileSync(filePath);
                    logsStacker.substitute('info', `${description}: loaded from file ${filePath}`);
                    break;
                } catch (e) {
                    logsStacker.put('warn', e.message);
                }
            }
        }
        if (!securityContent) {
            logsStacker.put(
                'error',
                `${description}: cannot load file from provided files: [${fileNames.join(',')}] nor from env var ${envVarName}`,
            );
        }

        logsStacker.typeLog('info');
        if (logsStacker.any('error')) {
            logsStacker.typeLog('warn');
            logsStacker.typeLog('error');
        }
        return securityContent;
    }

    static socksProvider() {
        const cern_socks_env_var = process.env.CERN_SOCKS;
        logger.info(`CERN_SOCKS set to '${cern_socks_env_var}'`);
        if (process.env.RUNNING_ENV == 'DOCKER' && cern_socks_env_var == 'true') {
            return 'socks://172.200.200.1:12345';
        }
        if (cern_socks_env_var) {
            if (cern_socks_env_var == 'false') {
                return null;
            }
            const socks = cern_socks_env_var.trim();
            if (socks.match(/socks:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+/)) {
                return socks;
            } else {
                logger.error(`incorrect format of socks address: ${socks}`);
            }
        }
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

    static passphraseProvider() {
        if (process.env.ALIMONITOR_PASSPHRASE) {
            logger.info('using passphrase');
        } else {
            logger.info('no passphrase');
        }
        return process.env.ALIMONITOR_PASSPHRASE;
    }
}
logger = new Log(ResProvider.name);

module.exports = ResProvider;
