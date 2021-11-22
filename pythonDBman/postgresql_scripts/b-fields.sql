CREATE TABLE IF NOT EXISTS public.b_fields
(
    id serial NOT NULL,
    period_id int NOT NULL,
    b_field text NOT NULL,
    PRIMARY KEY (id),
    constraint fk_period_id foreign key (period_id) references public.periods(id) on delete cascade
);

