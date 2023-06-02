
create or replace procedure insert_prod_details(
    _prod_name varchar,
    _run_number integer,
    _period varchar
)
LANGUAGE plpgsql
AS $$
DEClARE prod_id int;
BEGIN
    call insert_run(_run_number, _period, null, null, null, null, null, null, null, ARRAY[]::varchar[], null, null);
    SELECT id FROM data_passes INTO prod_id WHERE name = _prod_name;
    IF NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) THEN
        RAISE EXCEPTION 'no run %', now();
    END IF;
    
    IF prod_id IS NULL THEN
        RAISE EXCEPTION 'prod_id is null %', now();
    END IF;
    IF NOT EXISTS (SELECT * FROM data_passes_runs WHERE run_number = _run_number AND data_pass_id = prod_id) THEN
        INSERT INTO data_passes_runs(run_number, data_pass_id) VALUES(_run_number, prod_id);
    END IF;
END;
$$;



create or replace procedure insert_prod_details(
    _prod_name varchar,
    _run_numbers integer[],
    _period varchar
)
LANGUAGE plpgsql
AS $$
DEClARE prod_id int;
DECLARE _run_number integer;
BEGIN
    foreach _run_number in array _run_numbers loop
        call insert_run(_run_number, _period, null, null, null, null, null, null, null, ARRAY[]::varchar[], null, null);
        SELECT id FROM data_passes INTO prod_id WHERE name = _prod_name;
        IF NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) OR prod_id IS NULL THEN
            RAISE EXCEPTION 'nulls %', now();
        END IF;
        IF NOT EXISTS (SELECT * FROM data_passes_runs WHERE run_number = _run_number AND data_pass_id = prod_id) THEN
            INSERT INTO data_passes_runs(run_number, data_pass_id) VALUES(_run_number, prod_id);
        END IF;
    END LOOP;
END;
$$;