CREATE or REPLACE FUNCTION get_run_det_data(
    _run_number bigint,
    _detector_name varchar
) 
    returns varchar
language plpgsql
as $body$ 
declare ret integer:= null;
BEGIN
    SELECT rd.id INTO ret
        FROM runs_detectors AS rd 
        INNER JOIN detectors_subsystems AS ds 
            ON rd.detector_id = ds.id
        WHERE rd.run_number = _run_number AND ds.name = _detector_name;
    return ret::varchar;
END;
$body$;