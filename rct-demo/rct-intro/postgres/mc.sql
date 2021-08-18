CREATE TABLE IF NOT EXISTS public.mc
(
    id serial NOT NULL,
    period_id integer NOT NULL,
    run_number text NOT NULL,
    filling_scheme text,
    mu text,
    ir text,
    PRIMARY KEY (id)
);

ALTER TABLE public.mc
    OWNER to "rct-user";