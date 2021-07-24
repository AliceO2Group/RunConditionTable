CREATE TABLE IF NOT EXISTS public.runs
(
    id serial NOT NULL,
    period_id int NOT NULL,
    run_number int NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.runs
    OWNER to "rct-user";