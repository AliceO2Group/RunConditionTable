CREATE OR REPLACE FUNCTION zip(anyarray, anyarray)
  RETURNS SETOF anyarray LANGUAGE SQL AS
$func$
SELECT ARRAY[a,b] FROM (SELECT unnest($1) AS a, unnest($2) AS b) x;
$func$;
