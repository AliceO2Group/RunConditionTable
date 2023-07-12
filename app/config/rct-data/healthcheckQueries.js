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
const flags = require('./flags.json');
const physicalParticlesData = require('./physicalParticlesData.js');

const healthcheckQueries = {
    detectors: {
        description: 'detectors dict insert',
        query: detectors.map((d) => `INSERT INTO detectors_subsystems("id", "name") VALUES (DEFAULT, '${d}');`),
    },
    particle: {
        description: 'particles dict insert',
        query: Object.entries(physicalParticlesData).map(([name, d]) => `INSERT INTO particle_phys_data("id", "name", "full_name", "A", "Z")
                VALUES (DEFAULT, '${name}', '${d.full_name}', ${d.A}, ${d.Z});`),
    },
    flags: {
        description: 'flags types dict insert',
        query: flags.map((f) => `INSERT INTO flags_types_dictionary("id", "name", "method", "bad", "obsolate")
                VALUES (${f.id}, '${f.name}', '${f.method}', ${f.bad}::bool, ${f.obsolete}::bool);`),
    },
};

const suppressHealthcheckLogs = (process.env['RCT_SUPRESS_HEALTHCECK_LOGS']?.toLowerCase() || 'true') == 'true';

module.exports = {
    suppressHealthcheckLogs,
    healthcheckQueries,
};
