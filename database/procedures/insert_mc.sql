
CREATE OR REPLACE PROCEDURE insert_mc(
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
DECLARE an_period varchar;
DECLARE an_pass varchar;
DECLARE sp_id int;
DECLARE dp_ids int[];
DECLARE dp_id int;

BEGIN

    SELECT id INTO sp_id FROM simulation_passes WHERE name = _name;
    IF sp_id IS null AND array_length(_anchor_period, 1) > 0 AND array_length(_anchor_pass, 1) > 0 THEN
        -- sim pass insert
        INSERT INTO simulation_passes(     id,  name,  description,  jira,  ml,  pwg, number_of_events,  size) 
            VALUES                   (DEFAULT, _name, _description, _jira, _ml, _pwg,_number_of_events, _size);
        
        -- anchor insert
        SELECT id INTO sp_id FROM simulation_passes WHERE name = _name;
        IF _anchor_pass IS NOT null AND _anchor_period IS NOT null THEN
            foreach an_period IN array _anchor_period LOOP
                foreach an_pass IN array _anchor_pass LOOP
                    
                    SELECT id INTO trg_period_id
                        FROM periods WHERE name = an_period;
                    IF trg_period_id IS NOT null THEN
                        -- insert periods anchorage
                        INSERT INTO anchored_periods(period_id, sim_pass_id) 
                            VALUES(trg_period_id, sp_id);
                        
                        -- insert data_passes anchorage
                        SELECT array_agg(id::int) INTO dp_ids 
                            FROM data_passes 
                            WHERE name LIKE (an_period || '_' || an_pass || '%');
                        raise notice 'for % and % found data_pass_ids: %', an_period, an_pass, dp_ids;
                        IF dp_ids IS NOT null THEN
                            foreach dp_id IN array dp_ids LOOP
                                INSERT INTO anchored_passes(data_pass_id, sim_pass_id) 
                                    VALUES(dp_id, sp_id);
                            END LOOP;
                        END IF;
                    ELSE
                        raise warning 'an_period % does not exist', an_period;
                    END IF;

                END LOOP;
            END LOOP;

            IF NOT EXISTS (SELECT * FROM anchored_passes WHERE sim_pass_id = sp_id) OR
               NOT EXISTS (SELECT * FROM anchored_periods WHERE sim_pass_id = sp_id) THEN
                raise EXCEPTION 'not anchored';
            END IF;

        ELSE 
            raise notice 'not anchored';
        END IF;
    END IF;
END;
$$;

-- call insert_mc('lhc17jj', 'des', 'pwg', array['LHC22m']::varchar[], array['apass1']::varchar[], null, null, 10, 10);