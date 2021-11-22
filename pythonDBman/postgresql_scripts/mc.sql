CREATE TABLE IF NOT EXISTS public.mc
(
    id serial NOT NULL,
    mu text,
    run_number int NOT NULL,
    ir text,
    filling_scheme text,
    period_id integer NOT NULL,

    PRIMARY KEY (id),
    constraint fk_period_id foreign key (period_id) references public.periods(id) on delete cascade
);

