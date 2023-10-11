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
 const config = require('../../config/configProvider.js');
 const run_detectors_field_in_sql_query_factory = (dataPassName = null) => config.rctData.detectors
     .map(d => `(SELECT get_run_det_data(r.run_number, '${d.toUpperCase()}', '${dataPassName}')) as ${d.toUpperCase()}_detector`)
     .join(',\n')
 

const queryForRunsFields = `
        --p.name, 
        r.run_number,
        extract( epoch from r.time_o2_start ) * 1000 as time_o2_start,
        extract( epoch from r.time_o2_end ) * 1000 as time_o2_end,
        extract( epoch from r.time_trg_start ) * 1000 as time_trg_start,
        extract( epoch from r.time_trg_end ) * 1000 as time_trg_end,
        get_center_of_mass_energy(r.energy_per_beam, p.beam_type_id) as center_of_mass_energy, 
        r.fill_number,
        r.l3_current,
        r.dipole_current
`;
 
 
const runs_per_period_view = (query) => `
        SELECT
            ${queryForRunsFields},
            ${run_detectors_field_in_sql_query_factory()}
        FROM runs AS r
        INNER JOIN periods AS p
            ON p.id = r.period_id
        WHERE period_id = (
                            SELECT id 
                            FROM periods 
                            WHERE periods.name = '${query.index}'
                            )
        ORDER BY r.run_number DESC
        `;
 
const runs_per_data_pass_view = (query) => `
        SELECT
        ${queryForRunsFields},
        ${run_detectors_field_in_sql_query_factory(query.index)}
        FROM data_passes AS dp
        INNER JOIN data_passes_runs AS dpr
            ON dp.id=dpr.data_pass_id
        INNER JOIN runs AS r
            ON r.run_number=dpr.run_number
        INNER JOIN periods as p
            ON r.period_id = p.id
        WHERE dp.name = '${query.index}'
        ORDER BY r.run_number DESC
        `;
 

module.exports = {runs_per_period_view, runs_per_data_pass_view};
