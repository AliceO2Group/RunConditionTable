CREATE OR REPLACE FUNCTION get_verifications(
    _qcf_id integer
)
    returns JSON[]

LANGUAGE plpgsql
AS $body$
DECLARE ret JSON[] := null;
BEGIN

    SELECT array_agg(json_build_object('by', verified_by, 'verification_time', created_at)) 
        INTO ret
    FROM verifications
    WHERE qcf_id = _qcf_id;

    IF ret IS NULL THEN
        ret = ARRAY[]::JSON[];
    END IF;

    return ret;
END;
$body$;
