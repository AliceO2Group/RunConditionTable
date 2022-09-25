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

export const headersSpecials = {
    periods: {
        name: 'Name',
        year: 'Year',
        beam: 'Beam type',
        energy: 'Energy',
    },
    runsPerPeriod: {
        name: 'Name',
        run_number: 'Run number',
        start: 'Start time',
        end: 'End time',
        b_field: 'B field',
        energy_per_beam: 'Energy per beam',
        ir: 'IR',
        filling_scheme: 'Filling scheme',
        triggers_conf: 'Triggers conf.',
        fill_number: 'Fill number',
        run_type: 'Run type',
        mu: 'MU',
        time_trg_start: 'Trg. start',
        time_trg_end: 'Trg. end',
    },

    mc: {
        name: 'Name',
        description: 'Description',
        jira: 'Jira',
        ml: 'ML',
        pwg: 'PWG',
        number_of_events: 'Events number',
    },

    dataPasses: {
        name: 'Name',
        description: 'Description',
        pass_type: 'Type',
        jira: 'Jira',
        ml: 'ML',
        number_of_events: 'Events number',
        software_version: 'Soft. version',
        size: 'Size',
    },

    anchoredPerMC: {
        name: 'Name',
        description: 'Description',
        pass_type: 'Type',
        jira: 'Jira',
        ml: 'ML',
        number_of_events: 'Events number',
        software_version: 'Soft. version',
        size: 'Size',
    },
    anchoragePerDatapass: {
        name: 'Name',
        description: 'Description',
        jira: 'Jira',
        ml: 'ML',
        pwg: 'PWG',
        number_of_events: 'Events number',
    },

    runsPerDataPass: {
        name: 'Name',
        run_number: 'Run number',
        start: 'Start time',
        end: 'End time',
        b_field: 'B field',
        energy_per_beam: 'Energy per beam',
        ir: 'IR',
        filling_scheme: 'Filling scheme',
        triggers_conf: 'Triggers conf.',
        fill_number: 'Fill number',
        run_type: 'Run type',
        mu: 'MU',
        time_trg_start: 'Trg. start',
        time_trg_end: 'Trg. end',
    },

    flags: {
        start: 'Start time',
        end: 'End time',
        flag: 'Flag',
        comment: 'Comment',
        production_id: 'Prod. id',
        name: 'Name',
    },
};
