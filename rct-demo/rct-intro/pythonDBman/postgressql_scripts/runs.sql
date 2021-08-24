CREATE TABLE IF NOT EXISTS public.runs
(
    id serial NOT NULL,
    period_id int NOT NULL,
    -- LD --run_number int NOT NULL,
    PRIMARY KEY (id),
    constraint fk_period_id foreign key (period_id) references public.periods(id) on delete cascade
);

