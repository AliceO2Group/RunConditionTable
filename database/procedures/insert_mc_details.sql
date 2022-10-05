
create or replace procedure insert_mc_details(
    _prod_name varchar,
    _run_number integer
)
LANGUAGE plpgsql
AS $$
DEClARE prod_id int;
DECLARE run_id int;
BEGIN
    CALL insert_run(_run_number, null, null, null, null, null, null, null, null, null, null, null);
    SELECT id FROM simulation_passes INTO prod_id WHERE name = _prod_name;
    if prod_id IS NULL OR NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) THEN
        RAISE EXCEPTION 'nulls %', now();
    END IF;
    INSERT INTO simulation_passes_runs(run_id, simulation_pass_id, qc) 
        VALUES(run_id, prod_id, null);
END;
$$;