
create or replace procedure INSERT_mc(
    _name varchar, 
    _description text, 
    _pwg text,
    _anchored_periods varchar[],
    _anchor_passes varchar[],
    _jira text,
    _ml text,
    _number_of_events  integer,
    _size real)
LANGUAGE plpgsql
AS $$

DEClARE an_period varchar;
DEClARE an_pass varchar;
DEClARE sp_id int;
DEClARE dp_ids int[];
DEClARE dp_id int;
DECLARE p_id int;
DECLARE any_related_pass_found boolean;
BEGIN

    SELECT id INTO sp_id from simulation_passes where name = _name;
    IF sp_id IS NULL THEN
        -- sim pass INSERT
        INSERT INTO simulation_passes(
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
        -- anchor INSERT
        IF _anchor_passes IS NOT NULL AND _anchored_periods IS NOT NULL THEN
            any_related_pass_found = FALSE;
            foreach an_period in array _anchored_periods loop
                foreach an_pass in array _anchor_passes loop
                    SELECT id INTO sp_id FROM simulation_passes WHERE name = _name;
                    SELECT array_agg(id::int) INTO dp_ids from data_passes where name LIKE (an_period || '_' || an_pass || '%');
                    raise notice 'for % AND % found %', an_period, an_pass, dp_ids;
                    IF dp_ids IS NOT NULL THEN
                        any_related_pass_found = TRUE;
                        foreach dp_id in array dp_ids loop
                            IF NOT EXISTS (SELECT * from anchored_passes where data_pass_id = dp_id AND sim_pass_id = sp_id) THEN
                                INSERT INTO anchored_passes(data_pass_id, sim_pass_id) values(dp_id, sp_id);
                            END IF;
                        END loop;
                    END IF;
                END LOOP;
                IF any_related_pass_found THEN
                    SELECT id INTO p_id FROM periods WHERE name = an_period;
                    if not exists (select * from anchored_periods where period_id = p_id and  sim_pass_id  = sp_id) then
                        INSERT INTO anchored_periods(period_id, sim_pass_id) VALUES(p_id, sp_id);
                    end if;
                END IF;
            END LOOP;
        ELSE 
            raise notice 'NOT anchored';
        END IF;
    END IF;
END;
$$;
