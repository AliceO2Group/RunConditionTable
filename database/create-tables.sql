--
-- PostgreSQL database dump
--

-- Dumped from database version 13.6 (Debian 13.6-1.pgdg100+1)
-- Dumped by pg_dump version 14.2 (Debian 14.2-1.pgdg100+1)

-- Started on 2022-03-25 00:40:59 CET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 43259)
-- Name: beams_dictionary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.beams_dictionary (
    id integer NOT NULL,
    beam_type character varying(10) NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 43257)
-- Name: beams_dictionary_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.beams_dictionary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3115 (class 0 OID 0)
-- Dependencies: 218
-- Name: beams_dictionary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.beams_dictionary_id_seq OWNED BY public.beams_dictionary.id;


--
-- TOC entry 209 (class 1259 OID 43213)
-- Name: data_passes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_passes (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    pass_type integer NOT NULL,
    jira text,
    "ML" text,
    number_of_events integer NOT NULL,
    software_version text NOT NULL,
    size real NOT NULL
);


--
-- TOC entry 208 (class 1259 OID 43211)
-- Name: data_passes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_passes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3116 (class 0 OID 0)
-- Dependencies: 208
-- Name: data_passes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_passes_id_seq OWNED BY public.data_passes.id;


--
-- TOC entry 211 (class 1259 OID 43224)
-- Name: data_passes_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_passes_runs (
    id integer NOT NULL,
    run_id integer NOT NULL,
    production_id integer NOT NULL
);


--
-- TOC entry 210 (class 1259 OID 43222)
-- Name: data_passes_runs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_passes_runs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3117 (class 0 OID 0)
-- Dependencies: 210
-- Name: data_passes_runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_passes_runs_id_seq OWNED BY public.data_passes_runs.id;


--
-- TOC entry 213 (class 1259 OID 43232)
-- Name: detectors_subsystems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.detectors_subsystems (
    id integer NOT NULL,
    name character varying(10) NOT NULL
);


--
-- TOC entry 212 (class 1259 OID 43230)
-- Name: detectors_subsystems_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.detectors_subsystems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3118 (class 0 OID 0)
-- Dependencies: 212
-- Name: detectors_subsystems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.detectors_subsystems_id_seq OWNED BY public.detectors_subsystems.id;


--
-- TOC entry 223 (class 1259 OID 43275)
-- Name: flags_types_dictionary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flags_types_dictionary (
    id integer NOT NULL,
    flag text NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 43273)
-- Name: flags_types_dictionary_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flags_types_dictionary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3119 (class 0 OID 0)
-- Dependencies: 222
-- Name: flags_types_dictionary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flags_types_dictionary_id_seq OWNED BY public.flags_types_dictionary.id;


--
-- TOC entry 221 (class 1259 OID 43267)
-- Name: pass_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pass_types (
    id integer NOT NULL,
    pass_type character varying(10) NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 43265)
-- Name: pass_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pass_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3120 (class 0 OID 0)
-- Dependencies: 220
-- Name: pass_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pass_types_id_seq OWNED BY public.pass_types.id;


--
-- TOC entry 201 (class 1259 OID 43175)
-- Name: periods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.periods (
    id integer NOT NULL,
    name character varying(10) NOT NULL,
    year integer NOT NULL,
    beam_type_id integer NOT NULL
);


--
-- TOC entry 200 (class 1259 OID 43173)
-- Name: periods_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.periods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3121 (class 0 OID 0)
-- Dependencies: 200
-- Name: periods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.periods_id_seq OWNED BY public.periods.id;


--
-- TOC entry 217 (class 1259 OID 43248)
-- Name: quality_control_flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quality_control_flags (
    id integer NOT NULL,
    pass_run_id integer NOT NULL,
    run_detector_id integer NOT NULL,
    start integer NOT NULL,
    "end" integer NOT NULL,
    flag_type_id integer NOT NULL,
    comment text
);


--
-- TOC entry 216 (class 1259 OID 43246)
-- Name: quality_control_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quality_control_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3122 (class 0 OID 0)
-- Dependencies: 216
-- Name: quality_control_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quality_control_flags_id_seq OWNED BY public.quality_control_flags.id;


--
-- TOC entry 203 (class 1259 OID 43183)
-- Name: runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.runs (
    id integer NOT NULL,
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
    "timeTrgEnd" bigint NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 43240)
-- Name: runs_detectors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.runs_detectors (
    id integer NOT NULL,
    detector_id integer NOT NULL,
    run_id integer NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 43238)
-- Name: runs_detectors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.runs_detectors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3123 (class 0 OID 0)
-- Dependencies: 214
-- Name: runs_detectors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.runs_detectors_id_seq OWNED BY public.runs_detectors.id;


--
-- TOC entry 202 (class 1259 OID 43181)
-- Name: runs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.runs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3124 (class 0 OID 0)
-- Dependencies: 202
-- Name: runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.runs_id_seq OWNED BY public.runs.id;


--
-- TOC entry 224 (class 1259 OID 43284)
-- Name: sim_and_data_passess; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sim_and_data_passess (
    data_pass_id integer NOT NULL,
    sim_pass_id integer NOT NULL
);


--
-- TOC entry 205 (class 1259 OID 43191)
-- Name: simulation_passes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.simulation_passes (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    jira text,
    "ML" text,
    "PWG" text,
    number_of_events integer
);


--
-- TOC entry 204 (class 1259 OID 43189)
-- Name: simulation_passes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.simulation_passes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3125 (class 0 OID 0)
-- Dependencies: 204
-- Name: simulation_passes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.simulation_passes_id_seq OWNED BY public.simulation_passes.id;


--
-- TOC entry 207 (class 1259 OID 43202)
-- Name: simulation_passes_runs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.simulation_passes_runs (
    id integer NOT NULL,
    simulation_pass_id integer NOT NULL,
    run_id integer NOT NULL,
    qc text
);


--
-- TOC entry 206 (class 1259 OID 43200)
-- Name: simulation_passes_runs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.simulation_passes_runs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3126 (class 0 OID 0)
-- Dependencies: 206
-- Name: simulation_passes_runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.simulation_passes_runs_id_seq OWNED BY public.simulation_passes_runs.id;


--
-- TOC entry 2937 (class 2604 OID 43262)
-- Name: beams_dictionary id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beams_dictionary ALTER COLUMN id SET DEFAULT nextval('public.beams_dictionary_id_seq'::regclass);


--
-- TOC entry 2932 (class 2604 OID 43216)
-- Name: data_passes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_passes ALTER COLUMN id SET DEFAULT nextval('public.data_passes_id_seq'::regclass);


--
-- TOC entry 2933 (class 2604 OID 43227)
-- Name: data_passes_runs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_passes_runs ALTER COLUMN id SET DEFAULT nextval('public.data_passes_runs_id_seq'::regclass);


--
-- TOC entry 2934 (class 2604 OID 43235)
-- Name: detectors_subsystems id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.detectors_subsystems ALTER COLUMN id SET DEFAULT nextval('public.detectors_subsystems_id_seq'::regclass);


--
-- TOC entry 2939 (class 2604 OID 43278)
-- Name: flags_types_dictionary id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flags_types_dictionary ALTER COLUMN id SET DEFAULT nextval('public.flags_types_dictionary_id_seq'::regclass);


--
-- TOC entry 2938 (class 2604 OID 43270)
-- Name: pass_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_types ALTER COLUMN id SET DEFAULT nextval('public.pass_types_id_seq'::regclass);


--
-- TOC entry 2928 (class 2604 OID 43178)
-- Name: periods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periods ALTER COLUMN id SET DEFAULT nextval('public.periods_id_seq'::regclass);


--
-- TOC entry 2936 (class 2604 OID 43251)
-- Name: quality_control_flags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quality_control_flags ALTER COLUMN id SET DEFAULT nextval('public.quality_control_flags_id_seq'::regclass);


--
-- TOC entry 2929 (class 2604 OID 43186)
-- Name: runs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs ALTER COLUMN id SET DEFAULT nextval('public.runs_id_seq'::regclass);


--
-- TOC entry 2935 (class 2604 OID 43243)
-- Name: runs_detectors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs_detectors ALTER COLUMN id SET DEFAULT nextval('public.runs_detectors_id_seq'::regclass);


--
-- TOC entry 2930 (class 2604 OID 43194)
-- Name: simulation_passes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.simulation_passes ALTER COLUMN id SET DEFAULT nextval('public.simulation_passes_id_seq'::regclass);


--
-- TOC entry 2931 (class 2604 OID 43205)
-- Name: simulation_passes_runs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.simulation_passes_runs ALTER COLUMN id SET DEFAULT nextval('public.simulation_passes_runs_id_seq'::regclass);


--
-- TOC entry 2959 (class 2606 OID 43264)
-- Name: beams_dictionary beams_dictionary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.beams_dictionary
    ADD CONSTRAINT beams_dictionary_pkey PRIMARY KEY (id);


--
-- TOC entry 2949 (class 2606 OID 43221)
-- Name: data_passes data_passes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_passes
    ADD CONSTRAINT data_passes_pkey PRIMARY KEY (id);


--
-- TOC entry 2951 (class 2606 OID 43229)
-- Name: data_passes_runs data_passes_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_passes_runs
    ADD CONSTRAINT data_passes_runs_pkey PRIMARY KEY (id);


--
-- TOC entry 2953 (class 2606 OID 43237)
-- Name: detectors_subsystems detectors_subsystems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.detectors_subsystems
    ADD CONSTRAINT detectors_subsystems_pkey PRIMARY KEY (id);


--
-- TOC entry 2963 (class 2606 OID 43283)
-- Name: flags_types_dictionary flags_types_dictionary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flags_types_dictionary
    ADD CONSTRAINT flags_types_dictionary_pkey PRIMARY KEY (id);


--
-- TOC entry 2961 (class 2606 OID 43272)
-- Name: pass_types pass_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pass_types
    ADD CONSTRAINT pass_types_pkey PRIMARY KEY (id);


--
-- TOC entry 2941 (class 2606 OID 43180)
-- Name: periods periods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periods
    ADD CONSTRAINT periods_pkey PRIMARY KEY (id);


--
-- TOC entry 2957 (class 2606 OID 43256)
-- Name: quality_control_flags quality_control_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quality_control_flags
    ADD CONSTRAINT quality_control_flags_pkey PRIMARY KEY (id);


--
-- TOC entry 2955 (class 2606 OID 43245)
-- Name: runs_detectors runs_detectors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs_detectors
    ADD CONSTRAINT runs_detectors_pkey PRIMARY KEY (id);


--
-- TOC entry 2943 (class 2606 OID 43188)
-- Name: runs runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT runs_pkey PRIMARY KEY (id);


--
-- TOC entry 2965 (class 2606 OID 43288)
-- Name: sim_and_data_passess sim_and_data_passess_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_and_data_passess
    ADD CONSTRAINT sim_and_data_passess_pkey PRIMARY KEY (data_pass_id, sim_pass_id);


--
-- TOC entry 2945 (class 2606 OID 43199)
-- Name: simulation_passes simulation_passes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.simulation_passes
    ADD CONSTRAINT simulation_passes_pkey PRIMARY KEY (id);


--
-- TOC entry 2947 (class 2606 OID 43210)
-- Name: simulation_passes_runs simulation_passes_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.simulation_passes_runs
    ADD CONSTRAINT simulation_passes_runs_pkey PRIMARY KEY (id);


--
-- TOC entry 2969 (class 2606 OID 43304)
-- Name: simulation_passes_runs FK_29ff6b24-7f65-4efe-a634-c3cf7202baca; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.simulation_passes_runs
    ADD CONSTRAINT "FK_29ff6b24-7f65-4efe-a634-c3cf7202baca" FOREIGN KEY (simulation_pass_id) REFERENCES public.simulation_passes(id);


--
-- TOC entry 2972 (class 2606 OID 43319)
-- Name: data_passes_runs FK_600d65ec-fb01-49f3-bfdb-5ae2b1d86097; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_passes_runs
    ADD CONSTRAINT "FK_600d65ec-fb01-49f3-bfdb-5ae2b1d86097" FOREIGN KEY (production_id) REFERENCES public.data_passes(id);


--
-- TOC entry 2977 (class 2606 OID 43344)
-- Name: quality_control_flags FK_6a5ae29b-838b-42d7-bf8d-1db87b675c57; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quality_control_flags
    ADD CONSTRAINT "FK_6a5ae29b-838b-42d7-bf8d-1db87b675c57" FOREIGN KEY (run_detector_id) REFERENCES public.runs_detectors(id);


--
-- TOC entry 2968 (class 2606 OID 43299)
-- Name: simulation_passes_runs FK_799be3e6-6dc4-4a3e-b283-c8f89c14fd15; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.simulation_passes_runs
    ADD CONSTRAINT "FK_799be3e6-6dc4-4a3e-b283-c8f89c14fd15" FOREIGN KEY (run_id) REFERENCES public.runs(id);


--
-- TOC entry 2976 (class 2606 OID 43339)
-- Name: quality_control_flags FK_7f8d84d1-2fe2-495c-8103-98b284dd3215; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quality_control_flags
    ADD CONSTRAINT "FK_7f8d84d1-2fe2-495c-8103-98b284dd3215" FOREIGN KEY (flag_type_id) REFERENCES public.flags_types_dictionary(id);


--
-- TOC entry 2966 (class 2606 OID 43289)
-- Name: periods FK_7fe03f89-9b2f-422f-874b-3f2d0032eaca; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periods
    ADD CONSTRAINT "FK_7fe03f89-9b2f-422f-874b-3f2d0032eaca" FOREIGN KEY (beam_type_id) REFERENCES public.beams_dictionary(id);


--
-- TOC entry 2971 (class 2606 OID 43314)
-- Name: data_passes_runs FK_a38bad01-655c-473d-b655-8446b5437f86; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_passes_runs
    ADD CONSTRAINT "FK_a38bad01-655c-473d-b655-8446b5437f86" FOREIGN KEY (run_id) REFERENCES public.runs(id);


--
-- TOC entry 2974 (class 2606 OID 43329)
-- Name: runs_detectors FK_b65d6139-483d-4f27-a8bf-de97ba3f6453; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs_detectors
    ADD CONSTRAINT "FK_b65d6139-483d-4f27-a8bf-de97ba3f6453" FOREIGN KEY (run_id) REFERENCES public.runs(id);


--
-- TOC entry 2979 (class 2606 OID 43354)
-- Name: sim_and_data_passess FK_dc70d200-e000-4e65-89f9-e4ff5ac59d39; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_and_data_passess
    ADD CONSTRAINT "FK_dc70d200-e000-4e65-89f9-e4ff5ac59d39" FOREIGN KEY (sim_pass_id) REFERENCES public.simulation_passes(id);


--
-- TOC entry 2967 (class 2606 OID 43294)
-- Name: runs FK_dc889a81-5e52-4846-88dc-e4ad600f5fc6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT "FK_dc889a81-5e52-4846-88dc-e4ad600f5fc6" FOREIGN KEY (period_id) REFERENCES public.periods(id) ON DELETE CASCADE;


--
-- TOC entry 2973 (class 2606 OID 43324)
-- Name: runs_detectors FK_dd160c7e-283a-4503-8c77-287863c1ec59; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.runs_detectors
    ADD CONSTRAINT "FK_dd160c7e-283a-4503-8c77-287863c1ec59" FOREIGN KEY (detector_id) REFERENCES public.detectors_subsystems(id);


--
-- TOC entry 2978 (class 2606 OID 43349)
-- Name: sim_and_data_passess FK_ed9ce911-7f59-45b8-b0c6-2bc7d0bfda03; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sim_and_data_passess
    ADD CONSTRAINT "FK_ed9ce911-7f59-45b8-b0c6-2bc7d0bfda03" FOREIGN KEY (data_pass_id) REFERENCES public.data_passes(id);


--
-- TOC entry 2975 (class 2606 OID 43334)
-- Name: quality_control_flags FK_f0bca409-b863-4627-b689-d0b719c59a83; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quality_control_flags
    ADD CONSTRAINT "FK_f0bca409-b863-4627-b689-d0b719c59a83" FOREIGN KEY (pass_run_id) REFERENCES public.data_passes_runs(id);


--
-- TOC entry 2970 (class 2606 OID 43309)
-- Name: data_passes FK_f8b286fb-d76f-40b7-85d4-67393ea4a3ae; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_passes
    ADD CONSTRAINT "FK_f8b286fb-d76f-40b7-85d4-67393ea4a3ae" FOREIGN KEY (pass_type) REFERENCES public.pass_types(id);


-- Completed on 2022-03-25 00:40:59 CET

--
-- PostgreSQL database dump complete
--

