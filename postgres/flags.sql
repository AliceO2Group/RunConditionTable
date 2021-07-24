CREATE TABLE IF NOT EXISTS public.flags
(
    id serial NOT NULL,
    run_id int NOT NULL,
    start text NOT NULL,
    "end" text NOT NULL,
    flag text,
    comment text,
    PRIMARY KEY (id)
);

ALTER TABLE public.flags
    OWNER to "rct-user";