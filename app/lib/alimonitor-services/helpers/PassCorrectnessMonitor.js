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

const { switchCase } = require('../../utils');
const config = require('../../../config');

class PassCorrectnessMonitor {
    constructor(logger, errorsLoggingDepth) {
        this.logger = logger;
        this.errorsLoggingDepth = errorsLoggingDepth;
        this.correct = 0;
        this.incorrect = 0;
        this.omitted = 0;
        this.errors = [];
    }

    handleCorrect() {
        this.correct++;
    }

    handleIncorrect(e, data) {
        this.incorrect++;
        e.data = data;
        this.errors.push(e);
    }

    handleOmitted() {
        this.omitted++;
    }

    logResults() {
        const { correct, incorrect, omitted, errors, errorsLoggingDepth, logger } = this;
        const dataSize = incorrect + correct + omitted;

        if (incorrect > 0) {
            const logFunc = switchCase(errorsLoggingDepth, config.errorsLoggingDepths);
            errors.forEach((e) => logFunc(logger, e));
            logger.warn(`sync unseccessful for ${incorrect}/${dataSize}`);
        }
        if (omitted > 0) {
            logger.info(`omitted data units ${omitted}/${dataSize}`);
        }
    }
}

module.exports = PassCorrectnessMonitor;
