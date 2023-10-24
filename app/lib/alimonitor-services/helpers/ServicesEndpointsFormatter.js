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

const { services } = require('../../../config');

class ServicesEnpointsFormatter {
    static bookkeeping(page, limit) {
        return new URL(`${services.bookkeeping.url.ali}&page[offset]=${page * limit}&page[limit]=${limit}`);
    }

    static dataPassesRaw() {
        return new URL(services.monalisa.url.dataPassesRaw);
    }

    static dataPassesDetailed(description) {
        return new URL(`${services.monalisa.url.dataPassesDetailed}&filter_jobtype=${encodeURI(description)}`);
    }

    static mcRaw() {
        return new URL(services.monalisa.url.mcRaw);
    }

    static mcDetTag(tag) {
        return new URL(`${services.monalisa.url.mcDetTag}&tag=${tag}`);
    }
}

module.exports = ServicesEnpointsFormatter;
