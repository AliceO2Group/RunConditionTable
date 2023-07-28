CREATE or REPLACE FUNCTION prepare_runs_one_hot_query() 
    returns varchar
language plpgsql
as $body$ 
declare ret varchar:= null;
declare v varchar:= null;
BEGIN
    v = '(SELECT r.run_number, ds.name 
    FROM runs as r 
    INNER JOIN runs_detectors as rd 
        ON rd.run_number = r.run_number 
    INNER JOIN detectors_subsystems as ds 
        ON ds.id = rd.detector_id)';
    SELECT 'SELECT run_number, ' ||
        string_agg(format(E'\n      MAX(case when name=\'%s\' then %s else 0 end) %s_detector', name, id, name), ',') ||
    E'\n FROM  ' || v || E' AS runs_detectors_join\n' || E' GROUP BY run_number' into ret
    FROM (SELECT distinct id, name FROM detectors_subsystems) as sub;
    return ret;
END;
$body$;
