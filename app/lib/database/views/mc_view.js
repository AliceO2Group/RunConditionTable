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

const mc_view = (query) => `
        SELECT
            --sp.id
            sp.name,
            sp.description,
            sp.jira,
            sp.ml,
            sp.pwg,
            sp.number_of_events
        FROM simulation_passes AS sp 
        WHERE EXISTS (
                SELECT * 
                FROM anchored_periods as ap 
                INNER JOIN periods as p 
                    ON p.id = ap.period_id
                INNER JOIN simulation_passes as sp1
                    ON sp1.id = ap.sim_pass_id
                WHERE p.name = '${query.index}' AND
                    sp1.id = sp.id
                )
        `;

module.exports = mc_view;