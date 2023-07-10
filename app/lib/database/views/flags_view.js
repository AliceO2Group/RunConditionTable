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

const flags_view = (query) => {
    
    rn = query.run_numbers;
    let rn_sql = "";
    if (typeof(rn) === 'object') {
        rn_sql = rn.join(",");
    } else if (typeof(rn) === 'string') {
        rn_sql = rn
    } else {
        throw `run_number seems to be incorrect ${rn}`
    }

    let det_sql = "";
    if (query.detector) {
        det_sql = `AND ds.name = '${query.detector}'`
    }
    
    return `
    SELECT
        qcf.id, 
        qcf.time_start, 
        qcf.time_end, 
        ftd.name as flag_name, 
        qcf.comment,
        r.run_number,
        ds.name,
        array_agg(v.verified_by) as by,
        array_agg(v.verification_time) as ver_time


        FROM quality_control_flags AS qcf
        INNER JOIN data_passes as dp
            ON dp.id = qcf.data_pass_id
        INNER JOIN runs as r
            ON qcf.run_number = r.run_number
        INNER JOIN detectors_subsystems AS ds
            ON ds.id = qcf.detector_id
        INNER JOIN flags_types_dictionary as ftd
            ON ftd.id = qcf.flag_type_id
        LEFT OUTER JOIN verifications as v
            ON qcf.id = v.qcf_id

        WHERE r.run_number in (${rn_sql}) AND 
            dp.name = '${query.data_pass_name}'
            ${det_sql}
        GROUP BY qcf.id, qcf.time_start, qcf.time_end, ftd.name, qcf.comment, r.run_number, ds.name

    `;
}

module.exports = flags_view;