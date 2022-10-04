
create or replace procedure insert_mc(
    _name varchar, 
    _description text, 
    _pwg text,
    _anchor_period varchar[],
    _anchor_pass varchar[],
    _jira text,
    _ml text,
    _number_of_events  integer,
    _size real)
LANGUAGE plpgsql
AS $$

DECLARE trg_period_id int:= null;
DEClARE an_period varchar;
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
        SELECT id INTO sp_id FROM simulation_passes WHERE name = _name;
        IF _anchor_pass IS NOT null AND _anchor_period US NOT null THEN
            foreach an_period IN array _anchor_period LOOP
                foreach an_pass IN array _anchor_pass LOOP
                    
                    SELECT period_id INTO trg_period_id
                        FROM periods WHERE name = an_period;
                    IF trg_period_id IS NOT null THEN
                        -- insert periods anchorage
                        INSERT INTO anchored_periods(period_id, sim_pass_id) 
                            VALUES(trg_period_id, sp_id);
                        
                        -- insert data_passes anchorage
                        SELECT array_agg(id::int) INTO dp_ids 
                            FROM data_passes 
                            WHERE name LIKE (an_period || '_' || an_pass || '%');
                        raise notice 'for % and % found %', an_period, an_pass, dp_ids;
                        IF dp_ids IS NOT null THEN
                            foreach dp_id IN array dp_ids LOOP
                                INSERT INTO sim_and_data_passes(data_pass_id, sim_pass_id) 
                                    VALUES(dp_id, sp_id);
                            END LOOP;
                        END IF;

                    END IF;

                END LOOP;
            END LOOP;
        ELSE 
            raise notice 'not anchored';
        END IF;
    END IF;
end;
$$;

-- call insert_mc('lhc17jj', 'des', 'pwg', array['LHC22m']::varchar[], array['apass1']::varchar[], null, null, 10, 10);