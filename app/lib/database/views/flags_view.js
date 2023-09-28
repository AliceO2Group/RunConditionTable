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


const handleArray = (data, field, escape) => {
    let sqlLogicClause = undefined;
    if (Array.isArray(data)) {
        sqlLogicClause = data.map((d) => escape ? `'${d}'` : d).join(',');
    } else if (typeof(data) === 'string' || !data) {
        sqlLogicClause = escape ? `'${data}'` : data;
    } else {
        throw `incorrect format <${data}> for ${field}`;
    }
    sqlLogicClause = sqlLogicClause ? `${field} in (${sqlLogicClause})` : undefined;

    return sqlLogicClause;
}

const flags_view = (query) => {
    run_selection_sql = handleArray(query.run_numbers, 'r.run_number')
    detector_selection_sql = handleArray(query.detector, 'ds.name', true)

    const data_pass_sql = `dp.name = '${query.data_pass_name}'`;
    const whereClause = [data_pass_sql, run_selection_sql, detector_selection_sql]
        .filter(_ => _)
        .join(' AND ');
    
    return `
    SELECT
        qcf.id,
        qcf.entire,
        qcf.time_start, 
        qcf.time_end, 
        ftd.name as flag_reason, 
        qcf.comment,
        r.run_number,
        ds.name as detector,
        get_verifications(qcf.id) as verifications

        FROM quality_control_flags AS qcf
        INNER JOIN data_passes as dp
            ON dp.id = qcf.data_pass_id
        INNER JOIN runs as r
            ON qcf.run_number = r.run_number
        INNER JOIN detectors_subsystems AS ds
            ON ds.id = qcf.detector_id
        INNER JOIN flag_types_dictionary as ftd
            ON ftd.id = qcf.flag_type_id
        LEFT OUTER JOIN verifications as v
            ON qcf.id = v.qcf_id

        WHERE ${whereClause}
        GROUP BY qcf.id, qcf.time_start, qcf.time_end, ftd.name, qcf.comment, r.run_number, ds.name

    `;
}

module.exports = flags_view;
