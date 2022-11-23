create or replace procedure insert_period (
    _name varchar, 
    _year integer, 
    _beam_type varchar)
LANGUAGE plpgsql
AS $$

DEClARE trg_id int := null;
BEGIN
    IF _beam_type IS NOT NULL THEN
        SELECT id INTO trg_id FROM beams_dictionary WHERE beam_type = _beam_type;
        IF trg_id IS NULL AND _beam_type IS NOT NULL THEN
            raise notice 'trg_id is null: %', trg_id;
            -- inserting beam_type if not exists;
            INSERT INTO beams_dictionary(id, beam_type) VALUES(DEFAULT, _beam_type);
            SELECT id INTO trg_id FROM beams_dictionary WHERE beam_type = _beam_type;
            raise notice 'trg_id now is not null: %', trg_id;
        ELSE 
            raise notice 'id: %', trg_id;
        END IF ;
    END IF;
    SELECT id INTO trg_id from periods WHERE name = _name;
    IF trg_id IS NOT NULL THEN
        raise notice 'period % already exists', _name;
        IF _year IS NOT NULL THEN
            UPDATE periods SET year = _year WHERE name = _name; 
        END IF;
    ELSE
        INSERT INTO periods(id, name, year, beam_type_id) VALUES(DEFAULT, _name, _year, trg_id);
    END IF;
END;
$$;

