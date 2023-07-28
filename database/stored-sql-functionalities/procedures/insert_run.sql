
create or replace procedure insert_run(
    _run_number integer,
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
DEClARE trg_id int;
DEClARE curr_period varchar;

BEGIN
    if _period IS NULL THEN
        _period := 'TMP';
    END IF;

    SELECT id INTO trg_ID FROM periods WHERE name = _period;
    IF trg_id IS NULL THEN
        call insert_period(_period, null, null);
        SELECT id INTO trg_id FROM periods WHERE name = _period;
    END IF;
    raise notice 'id: %', trg_id;
    
    IF NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) THEN
        INSERT INTO runs(period_id, run_number, time_start, time_end, energy_per_beam, ir, filling_scheme, triggers_conf, fill_number, run_type, mu, time_trg_start, time_trg_end, l3_current, dipole_current) 
                    VALUES(trg_id, _run_number, _time_start, _time_end, _energy_per_beam, null, null, null, _fill_number, _run_type, null, _time_trg_start, _time_trg_end, _l3_current, _dipole_current);
    ELSE 
        raise notice 'run % already present', _run_number;

        SELECT p.name INTO curr_period 
            FROM runs AS r 
            INNER JOIN periods AS p 
                ON p.id = r.period_id 
            WHERE run_number = _run_number;
        IF curr_period = 'TMP' THEN
            SELECT id INTO trg_id FROM periods WHERE name = _period;
            UPDATE runs SET period_id = trg_id WHERE run_number = _run_number;
        END IF; --TODO else throw error or sth

        IF _time_start IS NOT NULL THEN 
            UPDATE runs SET time_start = _time_start WHERE run_number = _run_number; 
        END IF;
        IF _time_end IS NOT NULL THEN 
            UPDATE runs SET time_end = _time_end WHERE run_number = _run_number; 
        END IF;
        IF _energy_per_beam IS NOT NULL THEN 
            UPDATE runs SET energy_per_beam = _energy_per_beam WHERE run_number = _run_number; 
        END IF;
        IF _fill_number IS NOT NULL THEN 
            UPDATE runs SET fill_number = _fill_number WHERE run_number = _run_number; 
        END IF;
        IF _run_type IS NOT NULL THEN 
            UPDATE runs SET run_type = _run_type WHERE run_number = _run_number; 
        END IF;
        IF _time_trg_start IS NOT NULL THEN 
            UPDATE runs SET time_trg_start = _time_trg_start WHERE run_number = _run_number; 
        END IF;
        IF _time_trg_end IS NOT NULL THEN 
            UPDATE runs SET time_trg_end = _time_trg_end WHERE run_number = _run_number; 
        END IF;
        IF _l3_current IS NOT NULL THEN 
            UPDATE runs SET l3_current = _l3_current WHERE run_number = _run_number; 
        END IF;
        IF _dipole_current IS NOT NULL THEN 
            UPDATE runs SET dipole_current = _dipole_current WHERE run_number = _run_number; 
        END IF;
    END IF;

    call insert_detectors_for_runs(_run_number, _detectors);
END;
$$;
