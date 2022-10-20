

create or replace procedure insert_detectors_for_runs(
    _run_number bigint,
    _detectors varchar[]
)
LANGUAGE plpgsql
AS $$
DEClARE d varchar;
DEClARE trg_id int;
BEGIN
    foreach d in array _detectors loop
        raise notice 'detector %', d; 
        SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
        IF trg_id IS NULL THEN
            INSERT INTO detectors_subsystems(id, name) VALUES(DEFAULT, d);
            SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
        END IF;

        SELECT id INTO trg_id FROM runs_detectors WHERE detector_id = trg_id AND run_number = _run_number;
        IF trg_id IS NULL THEN
            SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
            INSERT INTO runs_detectors(id, detector_id, run_number) VALUES(DEFAULT, trg_id, _run_number);
        END IF;
    end loop;
END;
$$;