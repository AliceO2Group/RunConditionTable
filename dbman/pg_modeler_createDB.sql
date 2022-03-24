-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 0.9.4
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---
-- object: "rct-user" | type: ROLE --
-- DROP ROLE IF EXISTS "rct-user";
CREATE ROLE "rct-user" WITH 
	INHERIT
	LOGIN
	ENCRYPTED PASSWORD '********';
-- ddl-end --


-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: "rct-db-v3" | type: DATABASE --
-- DROP DATABASE IF EXISTS "rct-db-v3";
CREATE DATABASE "rct-db-v3"
	ENCODING = 'UTF8'
	LC_COLLATE = 'pl_PL.UTF-8'
	LC_CTYPE = 'pl_PL.UTF-8'
	TABLESPACE = pg_default
	OWNER = "rct-user";
-- ddl-end --


SET check_function_bodies = false;
-- ddl-end --

-- object: public.periods_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.periods_id_seq CASCADE;
CREATE SEQUENCE public.periods_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.periods_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.periods | type: TABLE --
-- DROP TABLE IF EXISTS public.periods CASCADE;
CREATE TABLE public.periods (
	id integer NOT NULL DEFAULT nextval('public.periods_id_seq'::regclass),
	name character varying(10) NOT NULL,
	year integer NOT NULL,
	beam_type_id integer NOT NULL,
	CONSTRAINT periods_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.periods OWNER TO postgres;
-- ddl-end --

-- object: public.runs_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.runs_id_seq CASCADE;
CREATE SEQUENCE public.runs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.runs_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.runs | type: TABLE --
-- DROP TABLE IF EXISTS public.runs CASCADE;
CREATE TABLE public.runs (
	id integer NOT NULL DEFAULT nextval('public.runs_id_seq'::regclass),
	period_id integer NOT NULL,
	run_number bigint NOT NULL,
	start bigint NOT NULL,
	"end" bigint NOT NULL,
	"B_field" character varying(12) NOT NULL,
	energy_per_beam character varying(10) NOT NULL,
	"IR" character varying(25),
	filling_scheme integer NOT NULL,
	triggers_conf character varying(25),
	fill_number integer NOT NULL,
	"runType" character varying(25),
	mu character varying(25),
	"timeTrgStart" bigint NOT NULL,
	"timeTrgEnd" bigint NOT NULL,
	CONSTRAINT runs_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.runs OWNER TO postgres;
-- ddl-end --

-- object: public.simulation_passes_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.simulation_passes_id_seq CASCADE;
CREATE SEQUENCE public.simulation_passes_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.simulation_passes_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.simulation_passes | type: TABLE --
-- DROP TABLE IF EXISTS public.simulation_passes CASCADE;
CREATE TABLE public.simulation_passes (
	id integer NOT NULL DEFAULT nextval('public.simulation_passes_id_seq'::regclass),
	name character varying(50) NOT NULL,
	description text,
	jira text,
	"ML" text,
	"PWG" text,
	number_of_events integer,
	CONSTRAINT simulation_passes_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.simulation_passes OWNER TO postgres;
-- ddl-end --

-- object: public.simulation_passes_runs_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.simulation_passes_runs_id_seq CASCADE;
CREATE SEQUENCE public.simulation_passes_runs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.simulation_passes_runs_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.simulation_passes_runs | type: TABLE --
-- DROP TABLE IF EXISTS public.simulation_passes_runs CASCADE;
CREATE TABLE public.simulation_passes_runs (
	id integer NOT NULL DEFAULT nextval('public.simulation_passes_runs_id_seq'::regclass),
	simulation_pass_id integer NOT NULL,
	run_id integer NOT NULL,
	qc text,
	CONSTRAINT simulation_passes_runs_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.simulation_passes_runs OWNER TO postgres;
-- ddl-end --

-- object: public.data_passes_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.data_passes_id_seq CASCADE;
CREATE SEQUENCE public.data_passes_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.data_passes_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.data_passes | type: TABLE --
-- DROP TABLE IF EXISTS public.data_passes CASCADE;
CREATE TABLE public.data_passes (
	id integer NOT NULL DEFAULT nextval('public.data_passes_id_seq'::regclass),
	name character varying(50) NOT NULL,
	description text,
	pass_type integer NOT NULL,
	jira text,
	"ML" text,
	number_of_events integer NOT NULL,
	software_version text NOT NULL,
	size real NOT NULL,
	CONSTRAINT data_passes_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.data_passes OWNER TO postgres;
-- ddl-end --

-- object: public.data_passes_runs_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.data_passes_runs_id_seq CASCADE;
CREATE SEQUENCE public.data_passes_runs_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.data_passes_runs_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.data_passes_runs | type: TABLE --
-- DROP TABLE IF EXISTS public.data_passes_runs CASCADE;
CREATE TABLE public.data_passes_runs (
	id integer NOT NULL DEFAULT nextval('public.data_passes_runs_id_seq'::regclass),
	run_id integer NOT NULL,
	production_id integer NOT NULL,
	CONSTRAINT data_passes_runs_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.data_passes_runs OWNER TO postgres;
-- ddl-end --

-- object: public.detectors_subsystems_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.detectors_subsystems_id_seq CASCADE;
CREATE SEQUENCE public.detectors_subsystems_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.detectors_subsystems_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.detectors_subsystems | type: TABLE --
-- DROP TABLE IF EXISTS public.detectors_subsystems CASCADE;
CREATE TABLE public.detectors_subsystems (
	id integer NOT NULL DEFAULT nextval('public.detectors_subsystems_id_seq'::regclass),
	name character varying(10) NOT NULL,
	CONSTRAINT detectors_subsystems_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.detectors_subsystems OWNER TO postgres;
-- ddl-end --

-- object: public.runs_detectors_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.runs_detectors_id_seq CASCADE;
CREATE SEQUENCE public.runs_detectors_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.runs_detectors_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.runs_detectors | type: TABLE --
-- DROP TABLE IF EXISTS public.runs_detectors CASCADE;
CREATE TABLE public.runs_detectors (
	id integer NOT NULL DEFAULT nextval('public.runs_detectors_id_seq'::regclass),
	detector_id integer NOT NULL,
	run_id integer NOT NULL,
	CONSTRAINT runs_detectors_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.runs_detectors OWNER TO postgres;
-- ddl-end --

-- object: public.quality_control_flags_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.quality_control_flags_id_seq CASCADE;
CREATE SEQUENCE public.quality_control_flags_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.quality_control_flags_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.quality_control_flags | type: TABLE --
-- DROP TABLE IF EXISTS public.quality_control_flags CASCADE;
CREATE TABLE public.quality_control_flags (
	id integer NOT NULL DEFAULT nextval('public.quality_control_flags_id_seq'::regclass),
	pass_run_id integer NOT NULL,
	run_detector_id integer NOT NULL,
	start integer NOT NULL,
	"end" integer NOT NULL,
	flag_type_id integer NOT NULL,
	comment text,
	CONSTRAINT quality_control_flags_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.quality_control_flags OWNER TO postgres;
-- ddl-end --

-- object: public.beams_dictionary_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.beams_dictionary_id_seq CASCADE;
CREATE SEQUENCE public.beams_dictionary_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.beams_dictionary_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.beams_dictionary | type: TABLE --
-- DROP TABLE IF EXISTS public.beams_dictionary CASCADE;
CREATE TABLE public.beams_dictionary (
	id integer NOT NULL DEFAULT nextval('public.beams_dictionary_id_seq'::regclass),
	beam_type character varying(10) NOT NULL,
	CONSTRAINT beams_dictionary_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.beams_dictionary OWNER TO postgres;
-- ddl-end --

-- object: public.pass_types_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.pass_types_id_seq CASCADE;
CREATE SEQUENCE public.pass_types_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.pass_types_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.pass_types | type: TABLE --
-- DROP TABLE IF EXISTS public.pass_types CASCADE;
CREATE TABLE public.pass_types (
	id integer NOT NULL DEFAULT nextval('public.pass_types_id_seq'::regclass),
	pass_type character varying(10) NOT NULL,
	CONSTRAINT pass_types_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.pass_types OWNER TO postgres;
-- ddl-end --

-- object: public.flags_types_dictionary_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.flags_types_dictionary_id_seq CASCADE;
CREATE SEQUENCE public.flags_types_dictionary_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.flags_types_dictionary_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public.flags_types_dictionary | type: TABLE --
-- DROP TABLE IF EXISTS public.flags_types_dictionary CASCADE;
CREATE TABLE public.flags_types_dictionary (
	id integer NOT NULL DEFAULT nextval('public.flags_types_dictionary_id_seq'::regclass),
	flag_type text NOT NULL,
	CONSTRAINT flags_types_dictionary_pkey PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.flags_types_dictionary OWNER TO postgres;
-- ddl-end --

-- object: public.sim_and_data_passess | type: TABLE --
-- DROP TABLE IF EXISTS public.sim_and_data_passess CASCADE;
CREATE TABLE public.sim_and_data_passess (
	data_pass_id integer NOT NULL,
	sim_pass_id integer NOT NULL,
	CONSTRAINT sim_and_data_passess_pkey PRIMARY KEY (data_pass_id,sim_pass_id)
);
-- ddl-end --
ALTER TABLE public.sim_and_data_passess OWNER TO postgres;
-- ddl-end --

-- object: public.periods_view | type: FUNCTION --
-- DROP FUNCTION IF EXISTS public.periods_view() CASCADE;
CREATE FUNCTION public.periods_view ()
	RETURNS smallint
	LANGUAGE sql
	VOLATILE 
	CALLED ON NULL INPUT
	SECURITY INVOKER
	PARALLEL UNSAFE
	COST 1
	AS $$
create view periods_view as (
		select p.year, p.name, btd.beam_type
		from periods as p
		inner join beams_dictionary as btd
			on btd.id = p.beam_type_id
)
	
$$;
-- ddl-end --
ALTER FUNCTION public.periods_view() OWNER TO postgres;
-- ddl-end --

-- object: "FK_7fe03f89-9b2f-422f-874b-3f2d0032eaca" | type: CONSTRAINT --
-- ALTER TABLE public.periods DROP CONSTRAINT IF EXISTS "FK_7fe03f89-9b2f-422f-874b-3f2d0032eaca" CASCADE;
ALTER TABLE public.periods ADD CONSTRAINT "FK_7fe03f89-9b2f-422f-874b-3f2d0032eaca" FOREIGN KEY (beam_type_id)
REFERENCES public.beams_dictionary (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_dc889a81-5e52-4846-88dc-e4ad600f5fc6" | type: CONSTRAINT --
-- ALTER TABLE public.runs DROP CONSTRAINT IF EXISTS "FK_dc889a81-5e52-4846-88dc-e4ad600f5fc6" CASCADE;
ALTER TABLE public.runs ADD CONSTRAINT "FK_dc889a81-5e52-4846-88dc-e4ad600f5fc6" FOREIGN KEY (period_id)
REFERENCES public.periods (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_799be3e6-6dc4-4a3e-b283-c8f89c14fd15" | type: CONSTRAINT --
-- ALTER TABLE public.simulation_passes_runs DROP CONSTRAINT IF EXISTS "FK_799be3e6-6dc4-4a3e-b283-c8f89c14fd15" CASCADE;
ALTER TABLE public.simulation_passes_runs ADD CONSTRAINT "FK_799be3e6-6dc4-4a3e-b283-c8f89c14fd15" FOREIGN KEY (run_id)
REFERENCES public.runs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_29ff6b24-7f65-4efe-a634-c3cf7202baca" | type: CONSTRAINT --
-- ALTER TABLE public.simulation_passes_runs DROP CONSTRAINT IF EXISTS "FK_29ff6b24-7f65-4efe-a634-c3cf7202baca" CASCADE;
ALTER TABLE public.simulation_passes_runs ADD CONSTRAINT "FK_29ff6b24-7f65-4efe-a634-c3cf7202baca" FOREIGN KEY (simulation_pass_id)
REFERENCES public.simulation_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_f8b286fb-d76f-40b7-85d4-67393ea4a3ae" | type: CONSTRAINT --
-- ALTER TABLE public.data_passes DROP CONSTRAINT IF EXISTS "FK_f8b286fb-d76f-40b7-85d4-67393ea4a3ae" CASCADE;
ALTER TABLE public.data_passes ADD CONSTRAINT "FK_f8b286fb-d76f-40b7-85d4-67393ea4a3ae" FOREIGN KEY (pass_type)
REFERENCES public.pass_types (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_a38bad01-655c-473d-b655-8446b5437f86" | type: CONSTRAINT --
-- ALTER TABLE public.data_passes_runs DROP CONSTRAINT IF EXISTS "FK_a38bad01-655c-473d-b655-8446b5437f86" CASCADE;
ALTER TABLE public.data_passes_runs ADD CONSTRAINT "FK_a38bad01-655c-473d-b655-8446b5437f86" FOREIGN KEY (run_id)
REFERENCES public.runs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_600d65ec-fb01-49f3-bfdb-5ae2b1d86097" | type: CONSTRAINT --
-- ALTER TABLE public.data_passes_runs DROP CONSTRAINT IF EXISTS "FK_600d65ec-fb01-49f3-bfdb-5ae2b1d86097" CASCADE;
ALTER TABLE public.data_passes_runs ADD CONSTRAINT "FK_600d65ec-fb01-49f3-bfdb-5ae2b1d86097" FOREIGN KEY (production_id)
REFERENCES public.data_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_dd160c7e-283a-4503-8c77-287863c1ec59" | type: CONSTRAINT --
-- ALTER TABLE public.runs_detectors DROP CONSTRAINT IF EXISTS "FK_dd160c7e-283a-4503-8c77-287863c1ec59" CASCADE;
ALTER TABLE public.runs_detectors ADD CONSTRAINT "FK_dd160c7e-283a-4503-8c77-287863c1ec59" FOREIGN KEY (detector_id)
REFERENCES public.detectors_subsystems (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_b65d6139-483d-4f27-a8bf-de97ba3f6453" | type: CONSTRAINT --
-- ALTER TABLE public.runs_detectors DROP CONSTRAINT IF EXISTS "FK_b65d6139-483d-4f27-a8bf-de97ba3f6453" CASCADE;
ALTER TABLE public.runs_detectors ADD CONSTRAINT "FK_b65d6139-483d-4f27-a8bf-de97ba3f6453" FOREIGN KEY (run_id)
REFERENCES public.runs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_f0bca409-b863-4627-b689-d0b719c59a83" | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS "FK_f0bca409-b863-4627-b689-d0b719c59a83" CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT "FK_f0bca409-b863-4627-b689-d0b719c59a83" FOREIGN KEY (pass_run_id)
REFERENCES public.data_passes_runs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_7f8d84d1-2fe2-495c-8103-98b284dd3215" | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS "FK_7f8d84d1-2fe2-495c-8103-98b284dd3215" CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT "FK_7f8d84d1-2fe2-495c-8103-98b284dd3215" FOREIGN KEY (flag_type_id)
REFERENCES public.flags_types_dictionary (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_6a5ae29b-838b-42d7-bf8d-1db87b675c57" | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS "FK_6a5ae29b-838b-42d7-bf8d-1db87b675c57" CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT "FK_6a5ae29b-838b-42d7-bf8d-1db87b675c57" FOREIGN KEY (run_detector_id)
REFERENCES public.runs_detectors (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_ed9ce911-7f59-45b8-b0c6-2bc7d0bfda03" | type: CONSTRAINT --
-- ALTER TABLE public.sim_and_data_passess DROP CONSTRAINT IF EXISTS "FK_ed9ce911-7f59-45b8-b0c6-2bc7d0bfda03" CASCADE;
ALTER TABLE public.sim_and_data_passess ADD CONSTRAINT "FK_ed9ce911-7f59-45b8-b0c6-2bc7d0bfda03" FOREIGN KEY (data_pass_id)
REFERENCES public.data_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "FK_dc70d200-e000-4e65-89f9-e4ff5ac59d39" | type: CONSTRAINT --
-- ALTER TABLE public.sim_and_data_passess DROP CONSTRAINT IF EXISTS "FK_dc70d200-e000-4e65-89f9-e4ff5ac59d39" CASCADE;
ALTER TABLE public.sim_and_data_passess ADD CONSTRAINT "FK_dc70d200-e000-4e65-89f9-e4ff5ac59d39" FOREIGN KEY (sim_pass_id)
REFERENCES public.simulation_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "grant_CU_eb94f049ac" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA public
   TO postgres;
-- ddl-end --

-- object: "grant_CU_cd8e46e7b6" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA public
   TO PUBLIC;
-- ddl-end --


