CREATE TABLE IF NOT EXISTS public.b_fields
(
    id serial NOT NULL,
    b_field text NOT NULL,
    run_id int NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.b_fields
    OWNER to "rct-user";