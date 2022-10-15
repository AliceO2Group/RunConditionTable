
CREATE OR REPLACE PROCEDURE insert_run(
    _run_number bigint,
    _period varchar,
    _time_trg_start bigint,
    _time_trg_end bigint,
    _time_start bigint,
    _time_end bigint,
    _run_type varchar,
    _fill_number integer,
    _energy_per_beam float,
    _detectors varchar[],
    _l3_current float,
    _dipole_current float)
LANGUAGE plpgsql
AS $$
DEClARE trg_period_id int;

BEGIN
    -- period handling
    if _period IS NULL THEN
        _period := 'TMP';
    END IF;

    SELECT id INTO trg_period_id FROM periods WHERE name = _period;
    IF trg_period_id IS NULL THEN
        CALL insert_period(_period, null, null);
        SELECT id INTO trg_period_id FROM periods WHERE name = _period;
    END IF;

    -- run handling
    IF NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) THEN
        INSERT INTO runs( run_number,     period_id,  time_start,  time_end,  l3_current,  dipole_current,  energy_per_beam,   ir, filling_scheme, triggers_conf,  fill_number,  run_type,   mu,  time_trg_start,  time_trg_end) 
                  VALUES(_run_number, trg_period_id, _time_start, _time_end, _l3_current, _dipole_current, _energy_per_beam, null,           null,          null, _fill_number, _run_type, null, _time_trg_start, _time_trg_end);
    ELSE 
        raise notice 'run % present already', _run_number;
        IF _period IS NOT NULL THEN
            SELECT id INTO trg_period_id FROM periods WHERE name = _period;
            UPDATE runs SET period_id = trg_period_id WHERE run_number = _run_number;
        END IF;
    END IF;

    -- detectors handling
    IF _detectors IS NOT NULL THEN
        CALL insert_detectors_for_runs(_run_number, _detectors);
    END IF;
END;
$$;

-- call insert_run (11111, 'LHC00a', null, null, null, null, null, null, null, null, null, null);
-- call insert_run (11111, 'LHC00a', null, null, null, null, null, null, null, ARRAY['a']::varchar[], null, null);