CREATE or REPLACE FUNCTION get_run_det_data(
    _run_number bigint,
    _detector_name varchar,
    _data_pass_name varchar
) 

    returns json
LANGUAGE plpgsql
AS $body$ 
DECLARE ret json:= null;

BEGIN

    raise notice 'data: % % %', _data_pass_name, _run_number, _detector_name;

    SELECT json_build_object(
        'qcf', qcf,
        'qcf_bkp', qcf_bkp
    ) INTO ret FROM (SELECT

        (SELECT json_build_object(
            'id', qcf.id, 
            'quality', lower(ftd.name)
            )
        FROM
            quality_control_flags AS qcf
            INNER JOIN flag_types_dictionary AS ftd
                ON ftd.id = qcf.flag_type_id
            INNER JOIN data_passes as dp
                ON dp.id = qcf.data_pass_id
            INNER JOIN detectors_subsystems as ds
                ON ds.id = qcf.detector_id
            WHERE
                dp.name = _data_pass_name AND
                ds.name = _detector_name AND
                qcf.run_number = _run_number
            ORDER BY qcf.updated_at DESC
            LIMIT 1
        ) as qcf
    ,
    
        (SELECT json_build_object(
                'quality', rd.quality
            )
            FROM runs_detectors AS rd
            INNER JOIN detectors_subsystems AS ds
                ON rd.detector_id = ds.id
            WHERE
                rd.run_number = _run_number AND
                ds.name = _detector_name
        ) as qcf_bkp

    ) as subq;

    return ret;
END;
$body$;
