CREATE TABLE IF NOT EXISTS public.periods
(
    id serial NOT NULL,
    "year" smallint NOT NULL,
    period text NOT NULL,
    beam text NOT NULL,
    energy text NOT NULL,
    data_pass text NOT NULL,
    Jira text NOT NULL,
    ML text NOT NULL,
    QC text NOT NULL,
    production text not null, --LD
    PRIMARY KEY (id)
);

