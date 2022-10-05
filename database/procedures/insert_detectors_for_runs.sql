

create or replace procedure insert_detectors_for_runs(
    _run_number bigint,
    _detectors varchar[]
)
LANGUAGE plpgsql
AS $$
DEClARE d varchar;
DEClARE trg_detector_id int;
DEClARE trg_pair_id int;

BEGIN
    foreach d in array _detectors loop
        -- detector handling
        SELECT id INTO trg_detector_id FROM detectors_subsystems WHERE name = d;
        IF trg_detector_id IS NULL THEN
            INSERT INTO detectors_subsystems(id, name) VALUES(DEFAULT, d);
            SELECT id INTO trg_detector_id FROM detectors_subsystems WHERE name = d;
        END IF;
        
        -- 
        SELECT id INTO trg_pair_id FROM runs_detectors 
            WHERE detector_id = trg_detector_id AND run_number = _run_number;
        IF trg_pair_id IS NULL THEN
            INSERT INTO runs_detectors(    detector_id,  run_number) 
                                VALUES(trg_detector_id, _run_number);
        END IF;
    END LOOP;
END;
$$;