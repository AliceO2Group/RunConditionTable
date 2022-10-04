
create or replace procedure insert_mc_details(
    _prod_name varchar,
    _run_number integer,
    _period varchar
)
LANGUAGE plpgsql
AS $$
DEClARE prod_id int;
DECLARE run_id int;
BEGIN
    CALL insert_run(_run_number, _period, null, null, null, null, null, null, null, ARRAY[]::varchar[], null, null);
    SELECT id from runs INTO run_id WHERE run_number = _run_number;
    SELECT id FROM simulation_passes INTO prod_id WHERE name = _prod_name;
    if run_id IS NULL OR prod_id IS NULL THEN
        RAISE EXCEPTION 'nulls %', now();
    END IF;
    INSERT INTO simulation_passes_runs(run_id, simulation_pass_id, qc) VALUES(run_id, prod_id, null);
END;
$$