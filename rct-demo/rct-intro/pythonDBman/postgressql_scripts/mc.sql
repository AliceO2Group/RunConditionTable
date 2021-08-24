CREATE TABLE IF NOT EXISTS public.mc
(
    id serial NOT NULL,
    mu text,
    run_id int NOT NULL,
    ir text,
    filling_scheme text,
    period_id integer NOT NULL,

    PRIMARY KEY (id),
    constraint fk_run_id foreign key (run_id) references public.runs(id) on delete cascade,
    constraint fk_period_id foreign key (period_id) references public.periods(id) on delete cascade
);

