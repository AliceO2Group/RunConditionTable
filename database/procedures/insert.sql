create or replace procedure insert_period (
    _name varchar, 
    _year integer, 
    _beam_type varchar)
LANGUAGE plpgsql
AS $$

DEClARE trg_id int := null;
BEGIN
    IF _beam_type IS NOT NULL THEN
        SELECT id INTO trg_id FROM beams_dictionary WHERE beam_type = _beam_type;
        IF trg_id IS NULL AND _beam_type IS NOT NULL THEN
            raise notice 'trg_id is null: %', trg_id;
            -- inserting beam_type if not exists;
            INSERT INTO beams_dictionary(id, beam_type) VALUES(DEFAULT, _beam_type);
            SELECT id INTO trg_id FROM beams_dictionary WHERE beam_type = _beam_type;
            raise notice 'trg_id now is not null: %', trg_id;
        ELSE 
            raise notice 'id: %', trg_id;
        END IF ;
    END IF;
    SELECT id INTO trg_id from periods WHERE name = _name;
    IF trg_id IS NOT NULL THEN
        raise notice 'period % already exists', _name;
        IF _year IS NOT NULL THEN
            UPDATE periods SET year = _year WHERE name = _name; 
        END IF;
    ELSE
        INSERT INTO periods(id, name, year, beam_type_id) VALUES(DEFAULT, _name, _year, trg_id);
    END IF;
END;
$$;


create or replace procedure insert_run(
    _run_number bigint,
    _period varchar,
    _time_trg_start bigint,
    _time_trg_stop bigint,
    _time_start bigint,
    _time_end bigint,
    _run_type varchar,
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
                VALUES(DEFAULT, trg_id, _run_number, _time_start, _time_end, null, _energy_per_beam, null, null, null, null, _run_type, null, _time_trg_start, _time_trg_stop);
    ELSE 
        riase notice 'run % already present', _run_number;
        IF _period IS NOT NULL THEN
            SELECT id INTO trg_id FROM periods WHERE name = _period;
            UPDATE runs SET period_id = trg_id WHERE run_number = _run_number;
        END IF;
    END IF;
    SELECT id INTO trg_id FROM runs WHERE run_number = _run_number;

    call insert_detectors_for_runs(trg_id, _detectors);
END;
$$;

create or replace procedure insert_detectors_for_runs(
    _run_id int,
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

        SELECT id INTO trg_id FROM runs_detectors WHERE detector_id = trg_id AND run_id = _run_id;
        IF trg_id IS NULL THEN
            SELECT id INTO trg_id FROM detectors_subsystems WHERE name = d;
            INSERT INTO runs_detectors(id, detector_id, run_id) VALUES(DEFAULT, trg_id, _run_id);
        END IF;
    end loop;
END;
$$;


create or replace procedure insert_prod(
    _name varchar, 
    _description text, 
    _pass_type varchar,
    _jira text,
    _ml text,
    _number_of_events  integer,
    _softwar_version text,
    _size real)
LANGUAGE plpgsql
AS $$

DEClARE trg_id int;
BEGIN
    if NOT _pass_type IS NULL THEN
        select id into trg_id from pass_types where pass_type = _pass_type;
        if trg_id IS NULL THEN
            raise notice 'trg_id is null: %', trg_id;
            -- inserting pass_type if not exists;
            insert into pass_types(id, pass_type) VALUES(DEFAULT, _pass_type);
            select id into trg_id from pass_types where pass_type = _pass_type;
            raise notice 'trg_id now is not null: %', trg_id;
        else 
            raise notice 'id: %', trg_id;
        end if ;
    else
        trg_id := null;
    end if;
    insert into data_passes(
        id, 
        name, 
        description, 
        pass_type, 
        jira, 
        ml, 
        number_of_events, 
        software_version, 
        size) values (
            DEFAULT, 
            _name, 
            _description, 
            trg_id, 
            _jira, 
            _ml, 
            _number_of_events, 
            _softwar_version, 
            _size);
end;
$$;



create or replace insert_prod_details(
    _prod_name varchar,
    _run_number integer,
    _period varchar
)
LANGUAGE plpgsql
AS $$
DEClARE prod_id int;
DECLARE run_id int;
BEGIN
    call insert_run(_run_number, _period, null, null, null, null, null, null, ARRAY[]::varchar[]);
    SELECT id from runs INTO run_id WHERE run_number = _run_number;
    SELECT id FROM data_passes INTO prod_id WHERE name = _name;
    INSERT INTO data_passes_runs(id, run_id, data_pass_id) VALUES(DEFAULT, run_id, prod_id);
END;
$$

-- call insert_prod ('LCH17f_pass1', 'dev asdf', 'tech', null, null, 12341, null, null);

-- call insert_run (1234, 'LHC22d', 1, 2, 3, 4, 'cosmic', 1234.1, ARRAY['TTG', 'ABC']);

-- drop procedure insert_detectors_for_runs, insert_prod, insert_run, insert_period;