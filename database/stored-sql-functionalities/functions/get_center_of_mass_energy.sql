

CREATE or REPLACE FUNCTION get_center_of_mass_energy(
    _energy_per_beam float,
    _beam_type varchar
) returns float

LANGUAGE plpgsql
AS $body$

DECLARE beam_t varchar;
DECLARE beam_type_split varchar[] := null;

DECLARE Av float;
DECLARE Zv float;
DECLARE P float := 1;

BEGIN
    if _beam_type is null or _energy_per_beam is null then
        return null;
    end if;

    beam_type_split = string_to_array(_beam_type, '-');
    if array_length(beam_type_split, 1) != 2 then
        --raise exception 'incorrect format of beam_type of name: "%"', _beam_type;
        return null;
    end if;

    foreach beam_t in array beam_type_split loop
        SELECT "A", "Z" INTO Av, Zv FROM particle_phys_data WHERE name = beam_t;
        IF Av is null or Zv is null then
            raise exception 'no defintion for particle of name: "%"', beam_t;
        end if;
        P = P * (_energy_per_beam * (Zv / Av));
    end loop;

    return 2 * sqrt(P);
END;
$body$;




CREATE or REPLACE FUNCTION get_center_of_mass_energy(
    _energy_per_beam float,
    _beam_type_id integer
) returns float

LANGUAGE plpgsql
AS $body$

DECLARE beam_type_t varchar;

BEGIN
    SELECT beam_type into beam_type_t from beams_dictionary where id = _beam_type_id;
    return get_center_of_mass_energy(_energy_per_beam, beam_type_t);
END;
$body$;
