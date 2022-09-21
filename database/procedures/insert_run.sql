
create or replace procedure insert_run(
    _run_number bigint,
    _period varchar,
    _time_trg_start bigint,
    _time_trg_stop bigint,
    _time_start bigint,
    _time_end bigint,
    _run_type varchar,
    _fill_number integer,
    _b_field float,
    _energy_per_beam float,
    _detectors varchar[])
LANGUAGE plpgsql
AS $$
DEClARE trg_id int;
DEClARE run_id int;

BEGIN
    if _period IS NULL THEN
        _period := 'TMP';
    END IF;

    SELECT id INTO trg_ID FROM periods WHERE name = _period;
    IF trg_id IS NULL THEN
        call insert_period(_period, null, null);
        SELECT id INTO trg_ID FROM periods WHERE name = _period;
    END IF;
    raise notice 'id: %', trg_id;

    SELECT id INTO run_id from runs where run_number = _run_number;
    IF run_id IS NULL THEN
        INSERT INTO runs(id, period_id, run_number, "start", "end", b_field, energy_per_beam, ir, filling_scheme, triggers_conf, fill_number, run_type, mu, time_trg_start, time_trg_end) 
                VALUES(DEFAULT, trg_id, _run_number, _time_start, _time_end, _b_field, _energy_per_beam, null, null, null, _fill_number, _run_type, null, _time_trg_start, _time_trg_stop);
    ELSE 
        raise notice 'run % already present', _run_number;
        IF _period IS NOT NULL THEN
            SELECT id INTO trg_id FROM periods WHERE name = _period;
            UPDATE runs SET period_id = trg_id WHERE run_number = _run_number;
        END IF;
    END IF;
    SELECT id INTO trg_id FROM runs WHERE run_number = _run_number;

    call insert_detectors_for_runs(trg_id, _detectors);
END;
$$;