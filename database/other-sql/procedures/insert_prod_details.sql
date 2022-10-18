
create or replace procedure insert_prod_details(
    _prod_name varchar,
    _run_number integer,
    _period varchar
)
LANGUAGE plpgsql
AS $$
DEClARE prod_id int;
BEGIN
    call insert_run(_run_number, _period, null, null, null, null, null, null, null, null, ARRAY[]::varchar[]);
    SELECT id FROM data_passes INTO prod_id WHERE name = _prod_name;
    if NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) OR prod_id IS NULL THEN
        RAISE EXCEPTION 'nulls %', now();
    END IF;
    INSERT INTO data_passes_runs(id, run_number, data_pass_id) VALUES(DEFAULT, _run_number, prod_id);
END;
$$