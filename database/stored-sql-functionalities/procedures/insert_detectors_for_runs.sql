

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
        SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;

        -- inserting new detectors
        IF trg_id IS NULL THEN
            raise notice 'new detector % !!!', d;
            INSERT INTO detectors_subsystems(id, name) VALUES(DEFAULT, d);
            SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
        END IF;

        -- inserting run x detector relation
        SELECT id INTO trg_id FROM runs_detectors WHERE detector_id = trg_id AND run_number = _run_number;
        IF trg_id IS NULL THEN
            SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
            INSERT INTO runs_detectors(id, detector_id, run_number) VALUES(DEFAULT, trg_id, _run_number);
        END IF;
    end loop;
END;
$$;