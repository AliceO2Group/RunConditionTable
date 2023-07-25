
DO                            
$do$
BEGIN
    PERFORM  SETVAL(c.oid, 1)
    FROM pg_class c JOIN pg_namespace n 
    ON n.oid = c.relnamespace 
    WHERE c.relkind = 'S' AND n.nspname = 'public'; 
END
$do$;


DO                            
$do$
BEGIN 
    EXECUTE (
        SELECT ('truncate "' ||  string_agg(table_name, '","') || '" cascade;') 
        FROM information_schema.tables 
        WHERE table_schema='public');
END
$do$;