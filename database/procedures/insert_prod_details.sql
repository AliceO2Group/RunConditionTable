
create or replace procedure insert_prod_details(
    _prod_name varchar,
    _run_number integer,
    _period varchar
)
LANGUAGE plpgsql
AS $$
DEClARE prod_id int;
BEGIN
    CALL insert_run(_run_number, _period, null, null, null, null, null, null, null, null, null, null);
    SELECT id FROM data_passes INTO prod_id WHERE name = _prod_name;
    IF prod_id IS NULL OR NOT EXISTS (SELECT * FROM runs WHERE run_number = _run_number) THEN
        RAISE EXCEPTION 'nulls %', now();
    END IF;
    INSERT INTO data_passes_runs( run_number, data_pass_id) 
                          VALUES(_run_number,      prod_id);
END;
$$;