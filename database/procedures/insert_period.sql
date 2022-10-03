create or replace procedure insert_period (
    _name varchar, 
    _year integer, 
    _beam_type varchar)
LANGUAGE plpgsql
AS $$

DECLARE trg_period_id int := null;
DECLARE trg_beam_type_id int := null;
DECLARE current_beam_type_id int:= null;
DECLARE current_year int:= null;

BEGIN
    -- checking beam_type existance
    IF _beam_type IS NOT NULL THEN
        SELECT id INTO trg_beam_type_id FROM beams_dictionary WHERE beam_type = _beam_type;
        IF trg_beam_type_id IS NULL AND _beam_type IS NOT NULL THEN
            raise notice 'trg_beam_type_id is null: %', trg_beam_type_id;
            INSERT INTO beams_dictionary(id, beam_type) VALUES(DEFAULT, _beam_type);
            SELECT id INTO trg_beam_type_id FROM beams_dictionary WHERE beam_type = _beam_type;
            raise notice 'trg_beam_type_id now is not null: %', trg_beam_type_id;
        ELSE 
            raise notice 'id: %', trg_beam_type_id;
        END IF ;
    END IF;

    -- checking period existance
    SELECT id INTO trg_period_id from periods WHERE name = _name;
    IF trg_period_id IS NOT NULL THEN
        raise notice 'period % (id: %) already exists', _name, trg_period_id;
        IF _year IS NOT NULL THEN
            SELECT year INTO current_year from periods WHERE id = trg_period_id;
            raise notice 'updating period (id: %) from % to %', trg_period_id, current_year, _year;
            UPDATE periods SET year = _year WHERE name = _name; 
        END IF;
        IF 
    ELSE
        INSERT INTO periods(id, name, year, beam_type_id) 
            VALUES(DEFAULT, _name, _year, trg_beam_type_id);
    END IF;
END;
$$;

