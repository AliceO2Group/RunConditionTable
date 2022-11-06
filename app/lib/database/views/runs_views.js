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
 const run_detectors_field_in_sql_query = config.baseData.database.detectors
     .map(d => `(SELECT get_run_det_data(r.run_number, '${d.toUpperCase()}')) as ${d.toUpperCase()}_detector`)
     .join(',\n')
 
 
 
 const runs_per_period_view = (query) => `
         SELECT
             --p.name, 
             r.run_number, 
             r.time_start, 
             r.time_end, 
             r.time_trg_start, 
             r.time_trg_end,
             r.energy_per_beam, 
             r.ir, 
             r.filling_scheme, 
             r.triggers_conf,
             r.fill_number,
             r.mu, 
             r.l3_current,
             r.dipole_current,
             ${run_detectors_field_in_sql_query}
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
                 --p.name, 
                 r.run_number, 
                 r.time_start, 
                 r.time_end, 
                 r.time_trg_start, 
                 r.time_trg_end,
                 r.energy_per_beam, 
                 r.ir, 
                 r.filling_scheme, 
                 r.triggers_conf,
                 r.fill_number,
                 r.mu, 
                 r.l3_current,
                 r.dipole_current,
                 ${run_detectors_field_in_sql_query}
             FROM data_passes AS dp
                 INNER JOIN data_passes_runs AS dpr
                     ON dp.id=dpr.data_pass_id
                 INNER JOIN runs AS r
                     ON r.run_number=dpr.run_number
             WHERE dp.name = '${query.index}'
             ORDER BY r.run_number DESC
            `;
 

module.exports = {runs_per_period_view, runs_per_data_pass_view};