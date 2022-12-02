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

const runsViews = {
    name: 'Name',
    run_number: 'Run number',
    time_start: 'Start time',
    time_end: 'End time',
    time_trg_start: 'Trg. start',
    time_trg_end: 'Trg. end',
    center_of_mass_energy: 'Center of mass energy [GeV]',
    ir: 'IR [Hz]',
    filling_scheme: 'Filling scheme',
    triggers_conf: 'Triggers conf.',
    fill_number: 'Fill number',
    run_type: 'Run type',
    mu: 'Mu',
    l3_current: 'L3 curr. [A]',
    dipole_current: 'Dipole curr. [A]',
};

const dpViews = {
    name: 'Name',
    description: 'Description',
    pass_type: 'Type',
    jira: 'Jira',
    ml: 'ML',
    number_of_events: 'Events number',
    software_version: 'Soft. version',
    size: 'Size',
};

const mcViews = {
    name: 'Name',
    description: 'Description',
    jira: 'Jira',
    ml: 'ML',
    pwg: 'PWG',
    number_of_events: 'Events number',
};

const headersSpecials = {
    periods: {
        name: 'Name',
        year: 'Year',
        beam: 'Beam type',
        energy: 'Mean energy [GeV]',
    },
    runsPerPeriod: runsViews,
    mc: mcViews,
    dataPasses: dpViews,
    anchoredPerMC: dpViews,
    anchoragePerDatapass: mcViews,
    runsPerDataPass: runsViews,

    flags: {
        start: 'Start time',
        end: 'End time',
        flag: 'Flag',
        comment: 'Comment',
        production_id: 'Prod. id',
        name: 'Name',
    },
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

export const filterApplicableHeader = 'filterApplicableHeader';
export const filterNonApplicableHeader = 'filterNonApplicableHeader';
export const nonDisplayable = 'nonDisplayable';

export const headerSpecPresent = (model, f) => headersSpecials[model.getCurrentDataPointer().page][f.name]
    ? filterApplicableHeader
    : /.*detector/.test(f.name)
        ? filterNonApplicableHeader
        : nonDisplayable;
