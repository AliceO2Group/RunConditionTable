/**
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

import { h } from '/js/src/index.js';
import { RCT } from '../../../config.js';
const { fieldNames: fN } = RCT;

const periodFields = Object.keys(fN.periods).reduce((acc, field) => ({ ...acc, [field]: fN.periods[field].fieldName }), {});

const runFields = {
    name: 'Name',
    run_number: 'Run',
    time_start: 'Start time',
    time_end: 'End time',
    time_trg_start: 'Trg. start',
    time_trg_end: 'Trg. end',
    center_of_mass_energy: h('.center-of-mass-energy'),
    ir: 'IR [Hz]',
    filling_scheme: 'Filling scheme',
    triggers_conf: 'Triggers conf.',
    fill_number: 'Fill',
    run_type: 'Run type',
    mu: '\u03BC',
    l3_current: 'L3 [A]',
    dipole_current: 'Dipole [A]',
};

const dpFields = {
    name: 'Name',
    description: 'Description',
    pass_type: 'Type',
    jira: 'Jira',
    ml: 'ML',
    number_of_events: 'Events',
    software_version: 'Soft. version',
    size: 'Size',
};

const mcFields = {
    name: 'Name',
    description: 'Description',
    jira: 'Jira',
    ml: 'ML',
    pwg: 'PWG',
    number_of_events: 'Events',
};

const flagFields = {
    time_start: 'Start',
    time_end: 'End',
    flag_reason: 'Reason',
    comment: 'Comment',
    by: 'Verified by',
    ver_time: 'Verification time',
};

const headersSpecials = {
    periods: periodFields,
    runsPerPeriod: runFields,
    mc: mcFields,
    dataPasses: dpFields,
    anchoredPerMC: dpFields,
    anchoragePerDatapass: mcFields,
    runsPerDataPass: runFields,
    flags: flagFields,
};

const runFieldNames = Object.keys(fN.runs).reduce((acc, field) => ({ ...acc, [field]: fN.runs[field].fieldName }), {});
const dpFieldNames = Object.keys(fN.dataPasses).reduce((acc, field) => ({ ...acc, [field]: fN.dataPasses[field].fieldName }), {});
const mcFieldNames = Object.keys(fN.mc).reduce((acc, field) => ({ ...acc, [field]: fN.mc[field].fieldName }), {});

const fieldNames = {
    periods: periodFields,
    runsPerPeriod: runFieldNames,
    mc: mcFieldNames,
    dataPasses: dpFieldNames,
    anchoredPerMC: dpFieldNames,
    anchoragePerDatapass: mcFieldNames,
    runsPerDataPass: runFieldNames,
    flags: flagFields,
};

export const getHeaderSpecial = (model, f) => {
    if (/.*_detector/.test(f.name)) {
        return f.name.split('_')[0];
    }
    const n = headersSpecials[model.getCurrentDataPointer().page][f.name];
    if (n) {
        return n;
    } else {
        return f.name;
    }
};

export const getFieldName = (model, f) => {
    if (/.*_detector/.test(f.name)) {
        return null;
    }
    const n = fieldNames[model.getCurrentDataPointer().page][f.name];
    if (n) {
        return n;
    } else {
        return f.name;
    }
};

export const filterApplicableHeader = 'filterApplicableHeader';
export const filterNonApplicableHeader = 'filterNonApplicableHeader';
export const nonDisplayable = 'nonDisplayable';

export const headerSpecPresent = (model, f) => headersSpecials[model.getCurrentDataPointer().page][f.name]
    ? filterApplicableHeader
    : /.*detector/.test(f.name)
        ? filterNonApplicableHeader
        : nonDisplayable;
