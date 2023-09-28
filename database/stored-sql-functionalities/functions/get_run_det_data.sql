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

    IF _data_pass_name IS NOT NULL THEN
        SELECT json_build_object(
            'id', qcf.id, 
            'entire', qcf.entire,
            'quality', lower(ftd.name), 
            'comment', qcf.comment
            ) INTO ret
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
                qcf.run_number = _run_number;
        IF ret is not null then
            return ret;
        END IF;
    END IF;

    
    SELECT json_build_object('quality', rd.quality ) INTO ret
        FROM runs_detectors AS rd 
        INNER JOIN detectors_subsystems AS ds 
            ON rd.detector_id = ds.id
        WHERE rd.run_number = _run_number AND ds.name = _detector_name;
    return ret;
END;
$body$;
