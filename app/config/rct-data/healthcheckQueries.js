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

const detectors = require('./detectors.js').sort();
const flags = require('./quality/flags.json');
const physicalParticlesData = require('./physicalParticlesData.js');

const checkStaticData = {
    detectors: {
        description: 'Detectors dict insert',
        query: detectors.map((d) => `INSERT INTO detectors_subsystems("id", "name") VALUES (DEFAULT, '${d}');`),
    },
    particle: {
        description: 'Particles dict insert',
        query: Object.entries(physicalParticlesData).map(([name, d]) => `INSERT INTO particle_phys_data("id", "name", "full_name", "a", "z")
            VALUES (DEFAULT, '${name}', '${d.full_name}', ${d.A}, ${d.Z});`),
    },
    flags: {
        description: 'Flag types dict insert',
        query: flags.map((f) => `INSERT INTO flag_types_dictionary("id", "name", "method", "bad", "obsolate")
            VALUES (${f.id}, '${f.name}', '${f.method}', ${f.bad}::bool, ${f.obsolete}::bool);`),
    },
};

const metaObj = {
    lastSync: {
        name: 'last_sync',
    },
};

const queryForName = (name) => `SELECT name, val, extract(epoch from "updatedAt") as "udatedAt" FROM meta WHERE name = '${name}'`;
const updateForName = (name, val) => `INSERT INTO meta (name, val, "updatedAt") values ('${name}', '${val}', now()) 
                                        ON conflict (name) do update set val = EXCLUDED.val, "updatedAt" = now();`;

const meta = {
    objects: metaObj,

    readLastSync: {
        description: 'Check time of last update',
        query: queryForName(metaObj.lastSync.name),
    },
    setLastSyncInProgress: {
        description: 'Store info in DB that sync is in progress',
        query: updateForName(metaObj.lastSync.name, 'in_progress'),
    },
    setLastSyncOK: {
        description: 'Store info in DB that sync is done',
        query: updateForName(metaObj.lastSync.name, 'ok'),
    },
    setLastSyncFailed: {
        description: 'Store info in DB that sync is done',
        query: updateForName(metaObj.lastSync.name, 'failed'),
    },
};

const healthcheckQueries = {
    checkStaticData,
    meta,
};

const suppressHealthcheckLogs = (process.env['RCT_SUPRESS_HEALTHCECK_LOGS']?.toLowerCase() || 'true') == 'true';

module.exports = {
    suppressHealthcheckLogs,
    healthcheckQueries,
};
