
create or replace procedure insert_prod(
    _name varchar,
    _period varchar,
    _description text, 
    _pass_type varchar,
    _jira text,
    _ml text,
    _number_of_events  integer,
    _softwar_version text,
    _size real)
LANGUAGE plpgsql
AS $$

DECLARE trg_pass_type_id int:= null;
DECLARE dp_id int:= null;
DECLARE trg_period_id int:= null;

BEGIN
    -- period handling
    SELECT id INTO trg_period_id FROM periods WHERE name = _period;
    IF trg_period_id IS NULL THEN
        CALL insert_period(_period, null, null);
        SELECT id INTO trg_period_id FROM periods WHERE name = _period;
    END IF;

    -- pass_type handling
    if NOT _pass_type IS NULL THEN
        SELECT id INTO trg_pass_type_id FROM pass_types WHERE pass_type = _pass_type;
        if trg_pass_type_id IS NULL THEN
            INSERT INTO pass_types(id, pass_type) VALUES(DEFAULT, _pass_type);
            SELECT id INTO trg_pass_type_id FROM pass_types WHERE pass_type = _pass_type;
        END IF ;
    END IF;

    -- dp inserting
    SELECT id INTO dp_id FROM data_passes WHERE name = _name;
    IF dp_id IS NULL THEN
        INSERT INTO data_passes( id,      name,     period_id,  description,        pass_type,  jira,  ml,  number_of_events, software_version,  size) 
                    VALUES     (DEFAULT, _name, trg_period_id, _description, trg_pass_type_id, _jira, _ml, _number_of_events, _softwar_version, _size);
    END IF;
END;
$$;