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

const anchored_per_mc_view = (query) => `
        SELECT 
            --dp.id
            dp.name,
            dp.description,
            dp.jira,
            dp.ml,
            dp.number_of_events,
            dp.software_version,
            dp.size
        FROM data_passes AS dp
        INNER JOIN anchored_passes as aps
            ON aps.data_pass_id = dp.id
        INNER JOIN simulation_passes as sp
            ON sp.id = aps.sim_pass_id
        WHERE sp.name = '${query.index}'
    `;

module.exports = anchored_per_mc_view;