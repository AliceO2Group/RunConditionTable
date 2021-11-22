--create user if not exists "rct-user" with encrypted password 'rct-passwd';
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'rct-user') THEN
            CREATE USER "rct-user" encrypted PASSWORD 'rct-passwd';
   END IF;
END
$do$;