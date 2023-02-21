create or replace procedure insert_period (
    _name varchar, 
    _year integer, 
    _beam_type varchar)
LANGUAGE plpgsql
AS $$

DECLARE trg_id int := null;
DECLARE beam_type_trg_id int := null;
BEGIN
    IF _beam_type IS NOT NULL THEN
        SELECT id INTO beam_type_trg_id FROM beams_dictionary WHERE beam_type = _beam_type;
        IF beam_type_trg_id IS NULL AND _beam_type IS NOT NULL THEN
            raise notice 'beam_type_trg_id is null: %', beam_type_trg_id;
            -- inserting beam_type if not exists;
            INSERT INTO beams_dictionary(id, beam_type) VALUES(DEFAULT, _beam_type);
            SELECT id INTO beam_type_trg_id FROM beams_dictionary WHERE beam_type = _beam_type;
            raise notice 'beam_type_trg_id now is not null: %', beam_type_trg_id;
        ELSE 
            raise notice 'id: %', beam_type_trg_id;
        END IF ;
    END IF;

    SELECT id INTO trg_id from periods WHERE name = _name;
    IF trg_id IS NOT NULL THEN
        raise notice 'period % already exists', _name;
        IF _year IS NOT NULL THEN
            UPDATE periods SET year = _year WHERE name = _name; 
        END IF;
    ELSE
        INSERT INTO periods(id, name, year, beam_type_id) VALUES(DEFAULT, _name, _year, beam_type_trg_id);
    END IF;
END;
$$;

