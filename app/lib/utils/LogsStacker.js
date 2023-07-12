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

const { Log } = require('@aliceo2/web-ui');

class LogsStacker {
    constructor(name) {
        this.messages = {};
        this.logger = new Log(name);
    }

    put(type, mess) {
        if (!this.messages[type]) {
            this.messages[type] = [];
        }
        this.messages[type].push(mess);
    }

    substitute(type, mess) {
        this.messages[type] = [mess];
    }

    log(type, func) {
        this.messages[type].forEach((m) => func(type, m));
    }

    logType(type) {
        if (this.messages[type]) {
            for (const m of this.messages[type]) {
                this.logger[type](m);
            }
        }
    }

    any(type) {
        return this.messages[type] ? this.messages[type].length > 0 : false;
    }
}

module.exports = LogsStacker;
