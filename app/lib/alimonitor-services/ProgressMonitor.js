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

class ProgressMonitor {
    constructor({ total, percentageStep, logger }) {
        this.total = total;
        this.percentageStep = percentageStep;
        this.progress = 0;
        this.lastLogAt = 0;
        this.logger = logger;
    }

    update(progress) {
        this.progress += progress;
    }

    setTotal(total) {
        this.total = total;
    }

    tryLog() {
        const potentialLogProgress = this.lastLogAt + this.percentageStep * this.total;
        if (this.progress >= potentialLogProgress || this.progress === this.total) {
            this.lastLogAt = this.progress;
            this.logger(`progress of ${this.progress} / ${this.total}`);
        }
    }
}

module.exports = ProgressMonitor;
