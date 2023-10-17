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

/**
 * Build part of sql where clause like 'FIELD_NAME in (...DATA...)';
 * @param {Array<String>|String} data - data to be used to build logical clause
 * @param {String} fieldName - field name in database
 * @param {Boolean} isString - if true values from data are wrapped with single quote
 * @returns {String|undefined} - logical clause
 */
const dataFieldToSQLBelongsLogicalClause = (data, fieldName, isString) => {
    if (!data) {
        return undefined;
    }
    if (!Array.isArray(data)) {
        data = [data];
    }
    const rightOperand = (isString ? data.map((value) => `'${value}'`) : data).join(',');
    return rightOperand ? `${fieldName} in (${rightOperand})` : undefined;
};

/**
 * Build sql query to fetch quality control flags for
 * one data pass and (if provided) given runs and detector subsystems
 * @param {Object} query containing data_pass_name (single name), run_numbers (list), detector (list)
 * @returns {String} sql query
 */
const flags_view = (query) => {
    const run_selection_sql = dataFieldToSQLBelongsLogicalClause(query.run_numbers, 'r.run_number');
    const detector_selection_sql = dataFieldToSQLBelongsLogicalClause(query.detector, 'ds.name', true);

    const data_pass_sql = `dp.name = '${query.data_pass_name}'`;
    const whereClause = [data_pass_sql, run_selection_sql, detector_selection_sql]
        .filter((clause) => clause)
        .join(' AND ');

    return `
    SELECT
        qcf.id,
        qcf.entire,
        EXTRACT(EPOCH FROM COALESCE(qcf.time_start, r.time_trg_start, r.time_o2_start)) * 1000 as time_start, 
        EXTRACT(EPOCH FROM COALESCE(qcf.time_end, r.time_trg_end, r.time_o2_end)) * 1000 as time_end, 
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
};

module.exports = flags_view;
