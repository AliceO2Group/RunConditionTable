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
    static servicesInterfacePfxCertProvider() {
        const cert_path = process.env.RCT_CERT_PATH;
        let cert;
        try {
            cert = fs.readFileSync(cert_path);
            logger.info('cert loaded from file');
        } catch (err) {
            logger.warn('cannot load cert file at $RCT_CERT_PATH');
        }
        if (!cert) {
            try {
                cert = fs.readFileSync(path.join(
                    __dirname, '..', '..', 'certs', 'ali-cert.p12',
                ));
                logger.info('cert loaded from statndard file');
            } catch (err) {
                logger.warn('cannot load cert file at standard');
            }
        }
        return cert;
    }

    static socksProvider() {
        logger.warn(`CERN_SOCKS set to '${process.env.CERN_SOCKS}'`);
        let socks = undefined;
        if (process.env.CERN_SOCKS) {
            socks = process.env.CERN_SOCKS.trim();
            if (socks.match(/socks:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+/)) {
                return socks;
            }
        }

        if (process.env.RUNNING_ENV == 'DOCKER' && process.env.CERN_SOCKS == 'true') {
            socks = 'socks://172.200.200.1:12345';
            return socks;
        }
        return undefined;
    }
}
logger = new Log(ResProvider.name);

module.exports = ResProvider;
