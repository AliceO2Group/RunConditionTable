-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 0.9.4-beta
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
-- object: "rct-db" | type: DATABASE --
-- DROP DATABASE IF EXISTS "rct-db";
CREATE DATABASE "rct-db"
	ENCODING = 'UTF8'
	LC_COLLATE = 'en_US.utf8'
	LC_CTYPE = 'en_US.utf8'
	TABLESPACE = pg_default
	OWNER = postgres;
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
	pass_type integer,
	jira text,
	ml text,
	number_of_events integer,
	software_version text,
	size real,
	CONSTRAINT data_passes_pkey PRIMARY KEY (id),
	CONSTRAINT dp_name_unique UNIQUE (name)

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
	data_pass_id integer NOT NULL,
	CONSTRAINT data_passes_runs_pkey PRIMARY KEY (id),
	CONSTRAINT dpr_pair_unique UNIQUE (run_id,data_pass_id)

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
	CONSTRAINT detectors_subsystems_pkey PRIMARY KEY (id),
	CONSTRAINT ds_name_unique UNIQUE (name)

);
-- ddl-end --
ALTER TABLE public.detectors_subsystems OWNER TO postgres;
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
	flag text NOT NULL,
	CONSTRAINT flags_types_dictionary_pkey PRIMARY KEY (id),
	CONSTRAINT ftp_name_unique UNIQUE (flag)

);
-- ddl-end --
ALTER TABLE public.flags_types_dictionary OWNER TO postgres;
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
	CONSTRAINT pass_types_pkey PRIMARY KEY (id),
	CONSTRAINT pt_name_unique UNIQUE (pass_type)

);
-- ddl-end --
ALTER TABLE public.pass_types OWNER TO postgres;
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
	name character varying(12) NOT NULL,
	year integer,
	beam_type_id integer,
	CONSTRAINT periods_pkey PRIMARY KEY (id),
	CONSTRAINT p_name_unique UNIQUE (name)

);
-- ddl-end --
ALTER TABLE public.periods OWNER TO postgres;
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
	CONSTRAINT runs_detectors_pkey PRIMARY KEY (id),
	CONSTRAINT rd_pair_unique UNIQUE (detector_id,run_id)

);
-- ddl-end --
ALTER TABLE public.runs_detectors OWNER TO postgres;
-- ddl-end --

-- object: public.runs | type: TABLE --
-- DROP TABLE IF EXISTS public.runs CASCADE;
CREATE TABLE public.runs (
	id integer NOT NULL DEFAULT nextval('public.runs_id_seq'::regclass),
	period_id integer NOT NULL,
	run_number bigint NOT NULL,
	start bigint,
	"end" bigint,
	b_field character varying(12),
	energy_per_beam float,
	ir character varying(25),
	filling_scheme integer,
	triggers_conf character varying(25),
	fill_number integer,
	run_type character varying(25),
	mu character varying(25),
	time_trg_start bigint,
	time_trg_end bigint,
	CONSTRAINT runs_pkey PRIMARY KEY (id),
	CONSTRAINT run_number_unique UNIQUE (run_number)

);
-- ddl-end --
ALTER TABLE public.runs OWNER TO postgres;
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
	ml text,
	pwg text,
	number_of_events integer,
	CONSTRAINT simulation_passes_pkey PRIMARY KEY (id),
	CONSTRAINT sp_name_unique UNIQUE (name)

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

-- object: pass_type_fk | type: CONSTRAINT --
-- ALTER TABLE public.data_passes DROP CONSTRAINT IF EXISTS pass_type_fk CASCADE;
ALTER TABLE public.data_passes ADD CONSTRAINT pass_type_fk FOREIGN KEY (pass_type)
REFERENCES public.pass_types (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: data_pass_fk | type: CONSTRAINT --
-- ALTER TABLE public.data_passes_runs DROP CONSTRAINT IF EXISTS data_pass_fk CASCADE;
ALTER TABLE public.data_passes_runs ADD CONSTRAINT data_pass_fk FOREIGN KEY (data_pass_id)
REFERENCES public.data_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: run_fk | type: CONSTRAINT --
-- ALTER TABLE public.data_passes_runs DROP CONSTRAINT IF EXISTS run_fk CASCADE;
ALTER TABLE public.data_passes_runs ADD CONSTRAINT run_fk FOREIGN KEY (run_id)
REFERENCES public.runs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: beam_type_fk | type: CONSTRAINT --
-- ALTER TABLE public.periods DROP CONSTRAINT IF EXISTS beam_type_fk CASCADE;
ALTER TABLE public.periods ADD CONSTRAINT beam_type_fk FOREIGN KEY (beam_type_id)
REFERENCES public.beams_dictionary (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: run_detector_fk | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS run_detector_fk CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT run_detector_fk FOREIGN KEY (run_detector_id)
REFERENCES public.runs_detectors (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: flag_type_fk | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS flag_type_fk CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT flag_type_fk FOREIGN KEY (flag_type_id)
REFERENCES public.flags_types_dictionary (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: pass_run_fk | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS pass_run_fk CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT pass_run_fk FOREIGN KEY (pass_run_id)
REFERENCES public.data_passes_runs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: run_fk | type: CONSTRAINT --
-- ALTER TABLE public.runs_detectors DROP CONSTRAINT IF EXISTS run_fk CASCADE;
ALTER TABLE public.runs_detectors ADD CONSTRAINT run_fk FOREIGN KEY (run_id)
REFERENCES public.runs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: detector_fk | type: CONSTRAINT --
-- ALTER TABLE public.runs_detectors DROP CONSTRAINT IF EXISTS detector_fk CASCADE;
ALTER TABLE public.runs_detectors ADD CONSTRAINT detector_fk FOREIGN KEY (detector_id)
REFERENCES public.detectors_subsystems (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: period_fk | type: CONSTRAINT --
-- ALTER TABLE public.runs DROP CONSTRAINT IF EXISTS period_fk CASCADE;
ALTER TABLE public.runs ADD CONSTRAINT period_fk FOREIGN KEY (period_id)
REFERENCES public.periods (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE NO ACTION;
-- ddl-end --

-- object: sim_passes_fk | type: CONSTRAINT --
-- ALTER TABLE public.sim_and_data_passess DROP CONSTRAINT IF EXISTS sim_passes_fk CASCADE;
ALTER TABLE public.sim_and_data_passess ADD CONSTRAINT sim_passes_fk FOREIGN KEY (sim_pass_id)
REFERENCES public.simulation_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: data_passes_fk | type: CONSTRAINT --
-- ALTER TABLE public.sim_and_data_passess DROP CONSTRAINT IF EXISTS data_passes_fk CASCADE;
ALTER TABLE public.sim_and_data_passess ADD CONSTRAINT data_passes_fk FOREIGN KEY (data_pass_id)
REFERENCES public.data_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: sim_pass_id | type: CONSTRAINT --
-- ALTER TABLE public.simulation_passes_runs DROP CONSTRAINT IF EXISTS sim_pass_id CASCADE;
ALTER TABLE public.simulation_passes_runs ADD CONSTRAINT sim_pass_id FOREIGN KEY (simulation_pass_id)
REFERENCES public.simulation_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: run_fk | type: CONSTRAINT --
-- ALTER TABLE public.simulation_passes_runs DROP CONSTRAINT IF EXISTS run_fk CASCADE;
ALTER TABLE public.simulation_passes_runs ADD CONSTRAINT run_fk FOREIGN KEY (run_id)
REFERENCES public.runs (id) MATCH SIMPLE
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

-- object: "grant_rawdDxt_d4c68ab9f5" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.beams_dictionary
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_136b61cd9a" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.beams_dictionary
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_72136a2a9f" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.data_passes
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_46523bc1de" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.data_passes
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_3a123c9652" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.data_passes_runs
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_8cfe5d9aa2" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.data_passes_runs
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_7e134d152c" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.detectors_subsystems
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_308efae596" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.detectors_subsystems
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_d9fa224fc7" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.flags_types_dictionary
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_07992b3208" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.flags_types_dictionary
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_1254c642dd" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.pass_types
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_bd6fe74e59" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.pass_types
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_042cc64133" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.periods
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_939d06a679" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.periods
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_590b49597e" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.quality_control_flags
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_d06b77b7dd" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.quality_control_flags
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_a9c75f3a93" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.runs
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_162e0ae8b5" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.runs
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_8d008e0763" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.runs_detectors
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_ef50381726" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.runs_detectors
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_86ca689ee8" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.sim_and_data_passess
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_73eb41175e" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.sim_and_data_passess
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_ab655b22a5" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.simulation_passes
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_c6e39fdf73" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.simulation_passes
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_9cedd5beaa" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.simulation_passes_runs
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_d3d2f3791a" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.simulation_passes_runs
   TO "rct-user";
-- ddl-end --


