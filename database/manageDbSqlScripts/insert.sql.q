create or replace procedure insert_period (
    _name varchar, 
    _yaer integer, 
    _beam_type varchar)
LANGUAGE plpgsql
AS $$

DEClARE trg_id int;
begin
    select id into trg_id from beams_dictionary where beam_type = _beam_type;
    if trg_id IS NULL THEN
        raise notice 'trg_id is null: %', trg_id;
        -- inserting beam_type if not exists;
        insert into beams_dictionary(id, beam_type) VALUES(DEFAULT, _beam_type);
        select id into trg_id from beams_dictionary where beam_type = _beam_type;
        raise notice 'trg_id now is not null: %', trg_id;
    else 
        raise notice 'id: %', trg_id;
    end if ;

    insert into periods(id, name, year, beam_type_id) values(DEFAULT, _name, _yaer, trg_id);
end;
$$;



create or replace procedure insert_prod(
    _name varchar, 
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
begin
    if NOT _pass_type IS NULL THEN
        select id into trg_id from pass_types where pass_Type = _pass_type;
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
        trg_id = null;
    end if;
    insert into data_passes(
        id, 
        name, 
        description, 
        pass_type, 
        jira, 
        ml, 
        number_of_events, 
        software_version, 
        size) values (
            DEFAULT, 
            _name, 
            _description, 
            trg_id, 
            _jira, 
            _ml, 
            _number_of_events, 
            _softwar_version, 
            _size);
end;
$$;

-- call insert_prod ('LCH17f_pass1', 'dev asdf', 'tech', null, null, 12341, null, null);