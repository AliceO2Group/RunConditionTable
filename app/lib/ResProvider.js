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

// eslint-disable-next-line prefer-const
let logger;

class ResProvider {
    // TODO generalize this methods ::( single content provider method) and (key:val provider method)
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

        return undefined;
    }

    static openid() {
        const openid = {
            secret: process.env.RCT_OPENID_SECRET,
            id: process.env.RCT_OPENID_ID,
            redirect_uri: process.env.RCT_OPENID_REDIRECT,
            well_known: 'https://auth.cern.ch/auth/realms/cern/.well-known/openid-configuration',
        };
        if (openid.secret && openid.id && openid.redirect_uri && openid.well_known) {
            logger.info('openid defined by env vars');
            return openid;
        }

        let openidConfPath = process.env.OPENID_PATH;
        if (!openidConfPath) {
            logger.info('not openid conf file path description via env var');
            openidConfPath = path.join(__dirname, '..', '..', 'security', 'openid.js');
        }
        if (fs.existsSync(openidConfPath)) {
            logger.info('reading openid configuration from file from security directory');
            return require(openidConfPath);
        } else {
            logger.warn('openid configuration file not set');
        }

        return undefined;
    }

    static database() {
        const database = {
            host: process.env.RCT_DB_HOST,
            database: process.env.RCT_DB_NAME,
            user: process.env.RCT_DB_USERNAME,
            password: process.env.RCT_DB_PASSWORD,
            port: 5432,
        };

        if (database.host && database.database && database.user && database.password && database.port) {
            logger.info('using database defined via env var');
            return database;
        } else {
            const nulledFields = Object.entries(database).filter((e) => ! e[1]).map((e) => e[0]);
            const mess = `unset fields: ' + ${nulledFields.join(', ')}`;
            logger.warn(`database passes not set properly ${mess}`);
            if (process.env.ENV_MODE == 'dev') {
                logger.info('env mode: using default values');
                return {
                    host: 'database',
                    database: 'rct-db',
                    user: 'rct-user',
                    password: 'rct-passwd',
                    port: 5432,
                };
            } else {
                logger.error('unset database');
            }
        }
    }

    static passphraseProvider() {
        if (process.env.ALIMONITOR_PASSPHRASE) {
            logger.info('using passphrase');
        }
        return process.env.ALIMONITOR_PASSPHRASE;
    }
}
logger = new Log(ResProvider.name);

module.exports = ResProvider;
