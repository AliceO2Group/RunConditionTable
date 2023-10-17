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

const flag_insert = (query) => `
    DO                            
    $do$
    DECLARE pass_id integer;
    DECLARE det_id integer;
    DECLARE flag_id integer;
    BEGIN
        select id into pass_id from data_passes where name = '${query.data_pass_name}';
        select id into det_id from detectors_subsystems where name = '${query.detector}';
        select id into flag_id from flag_types_dictionary where name = '${query.flag_type}';

        INSERT INTO quality_control_flags (data_pass_id, run_number, detector_id, flag_type_id, 
            time_start, time_end, comment, added_by, addition_time, last_modified_by, last_modification_time)
        VALUES(pass_id, ${query.run_number}, det_id, flag_id, 
            ${query.time_start}, ${query.time_end}, '${query.comment}', '${query.added_by}', now(), null, null);
    END
    $do$;
`;

const flag_delete = (query) => `
    DO                            
    $do$
    BEGIN
        DELETE FROM quality_control_flags where id = ${query.qcf_id};
    END
    $do$;
`;

const verification_insert = (query) => `
DO                            
$do$
BEGIN
    INSERT INTO verifications (qcf_id, created_at, verified_by)
    VALUES(${query.qcf_id}, now(), '${query.by}');
END
$do$;
`;

module.exports = {
    flag_insert,
    flag_delete,
    verification_insert,
};
