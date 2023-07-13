-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 1.0.4
-- PostgreSQL version: 15.0
-- Project Site: pgmodeler.io
-- Model Author: ---
-- object: "rct-user" | type: ROLE --
-- DROP ROLE IF EXISTS "rct-user";
CREATE ROLE "rct-user" WITH 
	INHERIT
	LOGIN
	 PASSWORD '********';
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
	period_id integer NOT NULL,
	description text,
	jira text,
	ml text,
	number_of_events integer,
	software_version text,
	size real,
	last_run integer NOT NULL,
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
	run_number integer NOT NULL,
	data_pass_id integer NOT NULL,
	CONSTRAINT dpr_pair_unique UNIQUE (run_number,data_pass_id),
	CONSTRAINT dpr_pk PRIMARY KEY (run_number,data_pass_id)
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
	id integer NOT NULL,
	name varchar NOT NULL,
	method varchar NOT NULL,
	bad bool NOT NULL,
	obsolate bool NOT NULL,
	CONSTRAINT flags_types_dictionary_pkey PRIMARY KEY (id),
	CONSTRAINT ftp_name_unique UNIQUE (name)
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
	data_pass_id integer NOT NULL,
	run_number integer NOT NULL,
	detector_id integer NOT NULL,
	flag_type_id integer NOT NULL,
	time_start bigint NOT NULL,
	time_end bigint NOT NULL,
	comment text,
	added_by varchar NOT NULL,
	addition_time timestamp with time zone NOT NULL,
	last_modified_by varchar,
	last_modification_time timestamp with time zone,
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
	detector_id integer NOT NULL,
	run_number integer NOT NULL,
	CONSTRAINT runs_detectors_pkey PRIMARY KEY (detector_id,run_number),
	CONSTRAINT rd_pair_unique UNIQUE (detector_id,run_number)
);
-- ddl-end --
ALTER TABLE public.runs_detectors OWNER TO postgres;
-- ddl-end --

-- object: public.runs | type: TABLE --
-- DROP TABLE IF EXISTS public.runs CASCADE;
CREATE TABLE public.runs (
	run_number integer NOT NULL,
	period_id integer NOT NULL,
	time_start bigint,
	time_end bigint,
	energy_per_beam float,
	ir character varying(25),
	filling_scheme integer,
	triggers_conf character varying(25),
	fill_number integer,
	run_type character varying(25),
	mu character varying(25),
	time_trg_start bigint,
	time_trg_end bigint,
	l3_current float,
	dipole_current float,
	CONSTRAINT runs_pk PRIMARY KEY (run_number)
);
-- ddl-end --
ALTER TABLE public.runs OWNER TO postgres;
-- ddl-end --

-- object: public.anchored_passes | type: TABLE --
-- DROP TABLE IF EXISTS public.anchored_passes CASCADE;
CREATE TABLE public.anchored_passes (
	data_pass_id integer NOT NULL,
	sim_pass_id integer NOT NULL,
	CONSTRAINT sim_and_data_passess_pkey PRIMARY KEY (data_pass_id,sim_pass_id),
	CONSTRAINT sim_and_dp_pk UNIQUE (data_pass_id,sim_pass_id)
);
-- ddl-end --
ALTER TABLE public.anchored_passes OWNER TO postgres;
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
	size real,
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
	simulation_pass_id integer NOT NULL,
	run_number integer NOT NULL,
	qc text,
	CONSTRAINT spr_pk PRIMARY KEY (simulation_pass_id,run_number),
	CONSTRAINT sim_pass_runs_pair_uq UNIQUE (simulation_pass_id,run_number)
);
-- ddl-end --
ALTER TABLE public.simulation_passes_runs OWNER TO postgres;
-- ddl-end --

-- object: public.anchored_periods | type: TABLE --
-- DROP TABLE IF EXISTS public.anchored_periods CASCADE;
CREATE TABLE public.anchored_periods (
	period_id integer NOT NULL,
	sim_pass_id integer NOT NULL,
	CONSTRAINT prim_key PRIMARY KEY (period_id,sim_pass_id),
	CONSTRAINT an_period_pair_uq UNIQUE (period_id,sim_pass_id)
);
-- ddl-end --
ALTER TABLE public.anchored_periods OWNER TO postgres;
-- ddl-end --

-- object: public.verifications | type: TABLE --
-- DROP TABLE IF EXISTS public.verifications CASCADE;
CREATE TABLE public.verifications (
	id serial NOT NULL,
	qcf_id integer NOT NULL,
	verification_time timestamp with time zone NOT NULL,
	verified_by varchar NOT NULL,
	CONSTRAINT verifications_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE public.verifications OWNER TO postgres;
-- ddl-end --

-- object: public.particle_phys_data | type: TABLE --
-- DROP TABLE IF EXISTS public.particle_phys_data CASCADE;
CREATE TABLE public.particle_phys_data (
	id serial NOT NULL,
	name varchar NOT NULL,
	full_name varchar NOT NULL,
	"A" smallint NOT NULL,
	"Z" smallint NOT NULL,
	CONSTRAINT particle_phys_data_pk PRIMARY KEY (id),
	CONSTRAINT name_unique UNIQUE (name),
	CONSTRAINT "Z_unique" UNIQUE ("Z"),
	CONSTRAINT full_name_unique UNIQUE (full_name)
);
-- ddl-end --
ALTER TABLE public.particle_phys_data OWNER TO postgres;
-- ddl-end --

-- object: public.meta | type: TABLE --
-- DROP TABLE IF EXISTS public.meta CASCADE;
CREATE TABLE public.meta (
	name varchar NOT NULL,
	val varchar NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT name_pk PRIMARY KEY (name)
);
-- ddl-end --
ALTER TABLE public.meta OWNER TO postgres;
-- ddl-end --

-- object: period_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.data_passes DROP CONSTRAINT IF EXISTS period_id_fk CASCADE;
ALTER TABLE public.data_passes ADD CONSTRAINT period_id_fk FOREIGN KEY (period_id)
REFERENCES public.periods (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: data_pass_fk | type: CONSTRAINT --
-- ALTER TABLE public.data_passes_runs DROP CONSTRAINT IF EXISTS data_pass_fk CASCADE;
ALTER TABLE public.data_passes_runs ADD CONSTRAINT data_pass_fk FOREIGN KEY (data_pass_id)
REFERENCES public.data_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: run_fk | type: CONSTRAINT --
-- ALTER TABLE public.data_passes_runs DROP CONSTRAINT IF EXISTS run_fk CASCADE;
ALTER TABLE public.data_passes_runs ADD CONSTRAINT run_fk FOREIGN KEY (run_number)
REFERENCES public.runs (run_number) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: beam_type_fk | type: CONSTRAINT --
-- ALTER TABLE public.periods DROP CONSTRAINT IF EXISTS beam_type_fk CASCADE;
ALTER TABLE public.periods ADD CONSTRAINT beam_type_fk FOREIGN KEY (beam_type_id)
REFERENCES public.beams_dictionary (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: flag_type_fk | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS flag_type_fk CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT flag_type_fk FOREIGN KEY (flag_type_id)
REFERENCES public.flags_types_dictionary (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: pass_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS pass_id_fk CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT pass_id_fk FOREIGN KEY (data_pass_id)
REFERENCES public.data_passes (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: run_number_fk | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS run_number_fk CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT run_number_fk FOREIGN KEY (run_number)
REFERENCES public.runs (run_number) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: detector_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.quality_control_flags DROP CONSTRAINT IF EXISTS detector_id_fk CASCADE;
ALTER TABLE public.quality_control_flags ADD CONSTRAINT detector_id_fk FOREIGN KEY (detector_id)
REFERENCES public.detectors_subsystems (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: run_fk | type: CONSTRAINT --
-- ALTER TABLE public.runs_detectors DROP CONSTRAINT IF EXISTS run_fk CASCADE;
ALTER TABLE public.runs_detectors ADD CONSTRAINT run_fk FOREIGN KEY (run_number)
REFERENCES public.runs (run_number) MATCH SIMPLE
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
-- ALTER TABLE public.anchored_passes DROP CONSTRAINT IF EXISTS sim_passes_fk CASCADE;
ALTER TABLE public.anchored_passes ADD CONSTRAINT sim_passes_fk FOREIGN KEY (sim_pass_id)
REFERENCES public.simulation_passes (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: data_passes_fk | type: CONSTRAINT --
-- ALTER TABLE public.anchored_passes DROP CONSTRAINT IF EXISTS data_passes_fk CASCADE;
ALTER TABLE public.anchored_passes ADD CONSTRAINT data_passes_fk FOREIGN KEY (data_pass_id)
REFERENCES public.data_passes (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: sim_pass_id | type: CONSTRAINT --
-- ALTER TABLE public.simulation_passes_runs DROP CONSTRAINT IF EXISTS sim_pass_id CASCADE;
ALTER TABLE public.simulation_passes_runs ADD CONSTRAINT sim_pass_id FOREIGN KEY (simulation_pass_id)
REFERENCES public.simulation_passes (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: run_fk | type: CONSTRAINT --
-- ALTER TABLE public.simulation_passes_runs DROP CONSTRAINT IF EXISTS run_fk CASCADE;
ALTER TABLE public.simulation_passes_runs ADD CONSTRAINT run_fk FOREIGN KEY (run_number)
REFERENCES public.runs (run_number) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: sim_pass_fk | type: CONSTRAINT --
-- ALTER TABLE public.anchored_periods DROP CONSTRAINT IF EXISTS sim_pass_fk CASCADE;
ALTER TABLE public.anchored_periods ADD CONSTRAINT sim_pass_fk FOREIGN KEY (sim_pass_id)
REFERENCES public.simulation_passes (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: period_id_fk | type: CONSTRAINT --
-- ALTER TABLE public.anchored_periods DROP CONSTRAINT IF EXISTS period_id_fk CASCADE;
ALTER TABLE public.anchored_periods ADD CONSTRAINT period_id_fk FOREIGN KEY (period_id)
REFERENCES public.periods (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: qcf_fk | type: CONSTRAINT --
-- ALTER TABLE public.verifications DROP CONSTRAINT IF EXISTS qcf_fk CASCADE;
ALTER TABLE public.verifications ADD CONSTRAINT qcf_fk FOREIGN KEY (qcf_id)
REFERENCES public.quality_control_flags (id) MATCH SIMPLE
ON DELETE CASCADE ON UPDATE NO ACTION;
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

-- object: "grant_rawdDxt_3f212f81cd" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.beams_dictionary
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_15379e790e" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.beams_dictionary
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_720c8fc738" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.data_passes
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_7a50f62aaf" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.data_passes
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_2d2128ad22" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.data_passes_runs
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_9c6f41d1f3" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.data_passes_runs
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_2d36ba7897" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.detectors_subsystems
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_e5591295ad" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.detectors_subsystems
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_83541d8bbc" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.flags_types_dictionary
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_64d10fc454" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.flags_types_dictionary
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_7e978c2efc" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.periods
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_df337b7e08" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.periods
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_534a4ca6a9" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.quality_control_flags
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_0f021317a9" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.quality_control_flags
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_829ba4c213" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.runs
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_5d4024ae7a" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.runs
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_1b41ed437f" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.runs_detectors
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_aeb5111d76" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.runs_detectors
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_1ee1aadf31" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.anchored_passes
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_7fce551008" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.anchored_passes
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_d1278511d2" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.simulation_passes
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_a99ac0ba05" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.simulation_passes
   TO "rct-user";
-- ddl-end --

-- object: "grant_rawdDxt_0f4f9a7705" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.simulation_passes_runs
   TO postgres;
-- ddl-end --

-- object: "grant_rawdDxt_ece5f3f730" | type: PERMISSION --
GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER
   ON TABLE public.simulation_passes_runs
   TO "rct-user";
-- ddl-end --


