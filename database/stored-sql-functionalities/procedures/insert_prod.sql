
create or replace procedure insert_prod(
    _name varchar, 
    _period varchar,
    _description text, 
    _jira text,
    _ml text,
    _number_of_events  integer,
    _softwar_version text,
    _size real)
LANGUAGE plpgsql
AS $$

DEClARE trg_period_id int;
DEClARE dp_id int;
BEGIN

    SELECT id INTO trg_period_id FROM periods WHERE name = _period;
    IF trg_period_id IS NULL THEN
        call insert_period(_period, null, null);
        SELECT id INTO trg_period_id FROM periods WHERE name = _period;
    END IF;


    SELECT id INTO dp_id from data_passes where name = _name;
    IF dp_id IS NULL THEN
        insert into data_passes(
            id,
            period_id ,
            name, 
            description, 
            jira, 
            ml, 
            number_of_events, 
            software_version, 
            size) values (
                DEFAULT, 
                trg_period_id,
                _name, 
                _description, 
                _jira, 
                _ml, 
                _number_of_events, 
                _softwar_version, 
                _size);
    END IF;
end;
$$;