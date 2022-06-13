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

// eslint-disable-next-line prefer-const
let logger;

class ResProvider {
    static securityFilesProvider(fileNames, description, envVarName = '_') {
        const file_path = process.env[envVarName];
        let securityContent;
        try {
            securityContent = fs.readFileSync(file_path);
            logger.info(`${description}: loaded from file`);
        } catch (err) {
            logger.warn(`cannot load file at ${envVarName} ${err}`);
        }
        if (!securityContent) {
            for (const fileName of fileNames) {
                try {
                    const filePath = path.join(
                        __dirname, '..', '..', 'security', fileName,
                    );
                    securityContent = fs.readFileSync(filePath);
                    logger.info(`${description}: loaded from file ${filePath}`);
                    break;
                // eslint-disable-next-line no-empty
                } catch (ignore) { }
            }
            if (!securityContent) {
                logger.warn(`${description}: cannot load file from provided files: [${fileNames.join(',')}]`);
            }
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

    static passphraseProvider() {
        if (process.env.ALIMONITOR_PASSPHRASE) {
            logger.info('using passphrase');
        }
        return process.env.ALIMONITOR_PASSPHRASE;
    }
}
logger = new Log(ResProvider.name);

module.exports = ResProvider;
