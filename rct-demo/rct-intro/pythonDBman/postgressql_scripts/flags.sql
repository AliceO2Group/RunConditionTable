CREATE TABLE IF NOT EXISTS public.flags
(
    id serial NOT NULL,
    "start" text NOT NULL,
    "end" text NOT NULL,
    flag text,
    comment text,
    run_id int NOT NULL,
    PRIMARY KEY (id),
    constraint fk_run_id foreign key(run_id) references public.runs(id) on delete cascade
);

