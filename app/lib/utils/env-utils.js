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

function isInTestMode() {
    return process.env.ENV_MODE === 'test';
}

function isInDevMode() {
    return process.env.ENV_MODE === 'dev';
}

function getEnvMode() {
    return process.env.ENV_MODE;
}

function getRunningEnv() {
    return process.env.RUNNING_ENV;
}

function runsOnDocker() {
    return getRunningEnv === 'DOCKER';
}

module.exports = {
    isInDevMode,
    isInTestMode,
    getEnvMode,
    getRunningEnv,
    runsOnDocker,
};
