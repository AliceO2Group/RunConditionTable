
create or replace procedure insert_mc_details(
    _prod_name varchar,
    _run_number integer,
    _period varchar
)
LANGUAGE plpgsql
AS $$
DEClARE prod_id int;
BEGIN
    call insert_run(_run_number, _period, null, null, null, null, null, null, null, ARRAY[]::varchar[], null, null);
    SELECT id FROM simulation_passes INTO prod_id WHERE name = _prod_name;
    if NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) OR prod_id IS NULL THEN
        RAISE EXCEPTION 'nulls %', now();
    END IF;
    INSERT INTO simulation_passes_runs(run_number, simulation_pass_id, qc) VALUES(_run_number, prod_id, null);
END;
$$;


create or replace procedure insert_mc_details(
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
        SELECT id FROM simulation_passes INTO prod_id WHERE name = _prod_name;
        if NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) OR prod_id IS NULL THEN
            RAISE EXCEPTION 'nulls %', now();
        END IF;
        INSERT INTO simulation_passes_runs(run_number, simulation_pass_id, qc) VALUES(_run_number, prod_id, null);
    END LOOP;
END;
$$