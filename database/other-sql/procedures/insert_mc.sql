
create or replace procedure insert_mc(
    _name varchar, 
    _description text, 
    _pwg text,
    _anchor_prod varchar[],
    _anchor_pass varchar[],
    _jira text,
    _ml text,
    _number_of_events  integer,
    _size real)
LANGUAGE plpgsql
AS $$

DEClARE an_prod varchar;
DEClARE an_pass varchar;
DEClARE sp_id int;
DEClARE dp_ids int[];
DEClARE dp_id int;
BEGIN

    SELECT id INTO sp_id from simulation_passes where name = _name;
    IF sp_id IS NULL THEN
        -- sim pass insert
        insert into simulation_passes(
            id, 
            name, 
            description, 
            jira, 
            ml,
            pwg,
            number_of_events,
            size) values (
                DEFAULT, 
                _name, 
                _description, 
                _jira, 
                _ml, 
                _pwg,
                _number_of_events, 
                _size);
        -- anchor insert
        if _anchor_pass is not null and _anchor_prod is not null then
            foreach an_prod in array _anchor_prod loop
                foreach an_pass in array _anchor_pass loop
                    SELECT id into sp_id FROM simulation_passes WHERE name = _name;
                    SELECT array_agg(id::int) into dp_ids from data_passes where name LIKE (an_prod || '_' || an_pass || '%');
                    raise notice 'for % and % found %', an_prod, an_pass, dp_ids;
                    if dp_ids is not null then
                        foreach dp_id in array dp_ids loop
                            insert into sim_and_data_passes(data_pass_id, sim_pass_id) values(dp_id, sp_id);
                        end loop;
                    end if;
                END LOOP;
            END LOOP;
        else 
            raise notice 'not anchored';
        end if;
    END IF;
end;
$$;

-- call insert_mc('lhc17jj', 'des', 'pwg', array['LHC22m']::varchar[], array['apass1']::varchar[], null, null, 10, 10);