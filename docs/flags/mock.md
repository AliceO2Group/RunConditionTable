# Flags mockup example

1. npm run dev
2. ./rctmake dump:restore -F bk_ml-all
3. npm run db:attach
```sql

truncate TABLE quality_control_flags cascade ;

DO                            
$do$
BEGIN
perform setval(c.oid, 1)
    FROM pg_class c JOIN pg_namespace n 
    ON n.oid = c.relnamespace 
    WHERE c.relkind = 'S' AND n.nspname = 'public' AND (c.relname = 'quality_control_flags_id_seq' OR c.relname = 'verifications_id_seq'); 
    END
    $do$;

insert into quality_control_flags (data_pass_id, run_number, detector_id, flag_type_id, time_start, time_end, added_by, addition_time, comment) 
VALUES 
(14, 527799, 2, 2, 1666371994000, 1666375994000, 'me', now(), 'takie sobie'),
(14, 527799, 2, 3, 1666376994000, 1666379994000, 'me', now(), 'lhc wybuchnie za 4, 3, 2...'),
(14, 527799, 2, 3, 1666381994000, 1666383111000, 'me', now(), 'idę robić kawę')
;

insert into quality_control_flags (data_pass_id, run_number, detector_id, flag_type_id, time_start, time_end, added_by, addition_time, comment) 
VALUES 
(14, 526689, 1, 2, 1664895606000, 1664896606000, 'me', now(), 'takie ie'),
(14, 526689, 1, 3, 1664895806000, 1664897606000, 'me', now(), 'lhc whnie za 4, 3, 2...'),
(14, 526689, 1, 10, 1664895906000, 1664898405000, 'me', now(), 'idę ć kawę')
;

insert into verifications(qcf_id, verification_time, verified_by)
VALUES 
(2, now(), 'PH1'),
(2, now(), 'PH2'),
(2, now(), 'PH3'),
(3, now(), 'PH1')
;


    SELECT
    qcf.id, 
    qcf.time_start, 
    qcf.time_end, 
    ftd.name, 
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
    INNER JOIN flag_types_dictionary as ftd
        ON ftd.id = qcf.flag_type_id
    LEFT OUTER JOIN verifications as v
        ON qcf.id = v.qcf_id
    
    WHERE r.run_number in (527799, 526689) AND 
        dp.name = 'LHC22o_apass4_lowIR'
    GROUP BY qcf.id, qcf.time_start, qcf.time_end, ftd.name, qcf.comment, r.run_number, ds.name
;
```
