
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

DEClARE trg_id int;
DEClARE trg_period_id int;
DEClARE dp_id int;
BEGIN
    if NOT _pass_type IS NULL THEN
        select id into trg_id from pass_types where pass_type = _pass_type;
        if trg_id IS NULL THEN
            raise notice 'trg_id is null: %', trg_id;
            -- inserting pass_type if not exists;
            insert into pass_types(id, pass_type) VALUES(DEFAULT, _pass_type);
            select id into trg_id from pass_types where pass_type = _pass_type;
            raise notice 'trg_id now is not null: %', trg_id;
        else 
            raise notice 'id: %', trg_id;
        end if ;
    else
        trg_id := null;
    END IF;

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
            pass_type, 
            jira, 
            ml, 
            number_of_events, 
            software_version, 
            size) values (
                DEFAULT, 
                trg_period_id,
                _name, 
                _description, 
                trg_id, 
                _jira, 
                _ml, 
                _number_of_events, 
                _softwar_version, 
                _size);
    END IF;
end;
$$;