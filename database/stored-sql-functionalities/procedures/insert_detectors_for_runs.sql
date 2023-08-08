

create or replace procedure insert_detectors_for_runs(
    _run_number bigint,
    _detectors varchar[],
    _detectors_qualities varchar[]
)
LANGUAGE plpgsql
AS $$
DECLARE d varchar;
DECLARE q varchar;

DECLARE dq varchar[];
DEClARE trg_id integer;
BEGIN
    for i in 1 .. array_upper(_detectors, 1) loop
        d = _detectors[i];
        q = _detectors_qualities[i];

        SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
        
        raise notice 'detector xdxd %', d;
        -- inserting new detectors
        IF trg_id IS NULL THEN
            raise notice 'new detector % !!!', d;
            INSERT INTO detectors_subsystems(id, name) VALUES(DEFAULT, d);
            SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
        END IF;

        -- inserting run x detector relation
        IF NOT EXISTS (SELECT * FROM runs_detectors WHERE detector_id = trg_id AND run_number = _run_number) THEN
            SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
            INSERT INTO runs_detectors(detector_id, run_number, quality) VALUES(trg_id, _run_number, q);
        END IF;
    end loop;
END;
$$;
