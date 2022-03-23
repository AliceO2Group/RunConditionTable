CREATE TABLE "periods" (
                           "id" SERIAL NOT NULL,
                           "name" VARCHAR(10) NOT NULL,
                           "year" INT NOT NULL,
                           "beam_type_id" INT NOT NULL,
                           PRIMARY KEY ("id")
);

CREATE TABLE "runs" (
                        "id" SERIAL,
                        "period_id" int NOT NULL,
                        "run_number" BIGINT NOT NULL,
                        "start" BIGINT NOT NULL,
                        "end" BIGINT NOT NULL,
                        "B_field" VARCHAR(12) NOT NULL,
                        "energy_per_beam" VARCHAR(10) NOT NULL,
                        "IR" VARCHAR(25),
                        "filling_scheme" INT NOT NULL,
                        "triggers_conf" VARCHAR(25),
                        "fill_number" int NOT NULL,
                        "runType" VARCHAR(25),
                        "mu" VARCHAR(25),
                        "timeTrgStart" BIGINT NOT NULL,
                        "timeTrgEnd" BIGINT NOT NULL,
                        PRIMARY KEY ("id")
);

CREATE TABLE "simulation_passes" (
                                     "id" SERIAL,
                                     "name" VARCHAR(50) NOT NULL,
                                     "description" TEXT,
                                     "jira" TEXT,
                                     "ML" TEXT,
                                     "PWG" TEXT,
                                     "number_of_events" INT,
                                     PRIMARY KEY ("id")
);

CREATE TABLE "simulation_passes_runs" (
                                          "id" SERIAL NOT NULL,
                                          "simulation_pass_id" INT NOT NULL,
                                          "run_id" INT NOT NULL,
                                          "qc" TEXT,
                                          PRIMARY KEY ("id")
);

CREATE TABLE "data_passes" (
                               "id" SERIAL,
                               "name" VARCHAR(50) NOT NULL,
                               "description" TEXT,
                               "pass_type" INT NOT NULL,
                               "jira" TEXT,
                               "ML" TEXT,
                               "number_of_events" INT NOT NULL,
                               "software_version" TEXT NOT NULL,
                               "size" REAL NOT NULL,
                               PRIMARY KEY ("id")
);

CREATE TABLE "data_passes_runs" (
                                    "id" SERIAL,
                                    "run_id" INT NOT NULL,
                                    "production_id" INT NOT NULL,
                                    PRIMARY KEY ("id")
);

CREATE TABLE "detectors_subsystems" (
                                        "id" SERIAL NOT NULL,
                                        "name" VARCHAR(10) NOT NULL,
                                        PRIMARY KEY ("id")
);

CREATE TABLE "runs_detectors" (
                                  "id" SERIAL NOT NULL,
                                  "detector_id" INT NOT NULL,
                                  "run_id" INT NOT NULL,
                                  PRIMARY KEY ("id")
);

CREATE TABLE "quality_control_flags" (
                                         "id" SERIAL NOT NULL,
                                         "pass_run_id" INT NOT NULL,
                                         "run_detector_id" INT NOT NULL,
                                         "start" INT NOT NULL,
                                         "end" INT NOT NULL,
                                         "flag_type_id" INT NOT NULL,
                                         "comment" TEXT,
                                         PRIMARY KEY ("id")
);

CREATE TABLE "beams_dictionary" (
                                    "id" SERIAL NOT NULL,
                                    "beam_type" VARCHAR(10) NOT NULL,
                                    PRIMARY KEY ("id")
);

CREATE TABLE "pass_types" (
                              "id" SERIAL NOT NULL,
                              "pass_type" VARCHAR(10) NOT NULL,
                              PRIMARY KEY ("id")
);

CREATE TABLE "flags_types_dictionary" (
                                          "id" SERIAL NOT NULL,
                                          "flag" TEXT NOT NULL,
                                          PRIMARY KEY ("id")
);

CREATE TABLE "sim_and_data_passess" (
                                        "data_pass_id" INT NOT NULL,
                                        "sim_pass_id" INT NOT NULL,
                                        PRIMARY KEY ("data_pass_id", "sim_pass_id")
);


ALTER TABLE "periods" ADD CONSTRAINT "FK_7fe03f89-9b2f-422f-874b-3f2d0032eaca" FOREIGN KEY ("beam_type_id") REFERENCES "beams_dictionary"("id")  ;

ALTER TABLE "runs" ADD CONSTRAINT "FK_dc889a81-5e52-4846-88dc-e4ad600f5fc6" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ;

ALTER TABLE "simulation_passes_runs" ADD CONSTRAINT "FK_799be3e6-6dc4-4a3e-b283-c8f89c14fd15" FOREIGN KEY ("run_id") REFERENCES "runs"("id")  ;

ALTER TABLE "simulation_passes_runs" ADD CONSTRAINT "FK_29ff6b24-7f65-4efe-a634-c3cf7202baca" FOREIGN KEY ("simulation_pass_id") REFERENCES "simulation_passes"("id")  ;

ALTER TABLE "data_passes" ADD CONSTRAINT "FK_f8b286fb-d76f-40b7-85d4-67393ea4a3ae" FOREIGN KEY ("pass_type") REFERENCES "pass_types"("id")  ;

ALTER TABLE "data_passes_runs" ADD CONSTRAINT "FK_a38bad01-655c-473d-b655-8446b5437f86" FOREIGN KEY ("run_id") REFERENCES "runs"("id")  ;

ALTER TABLE "data_passes_runs" ADD CONSTRAINT "FK_600d65ec-fb01-49f3-bfdb-5ae2b1d86097" FOREIGN KEY ("production_id") REFERENCES "data_passes"("id")  ;

ALTER TABLE "runs_detectors" ADD CONSTRAINT "FK_dd160c7e-283a-4503-8c77-287863c1ec59" FOREIGN KEY ("detector_id") REFERENCES "detectors_subsystems"("id")  ;

ALTER TABLE "runs_detectors" ADD CONSTRAINT "FK_b65d6139-483d-4f27-a8bf-de97ba3f6453" FOREIGN KEY ("run_id") REFERENCES "runs"("id")  ;

ALTER TABLE "quality_control_flags" ADD CONSTRAINT "FK_f0bca409-b863-4627-b689-d0b719c59a83" FOREIGN KEY ("pass_run_id") REFERENCES "data_passes_runs"("id")  ;

ALTER TABLE "quality_control_flags" ADD CONSTRAINT "FK_7f8d84d1-2fe2-495c-8103-98b284dd3215" FOREIGN KEY ("flag_type_id") REFERENCES "flags_types_dictionary"("id")  ;

ALTER TABLE "quality_control_flags" ADD CONSTRAINT "FK_6a5ae29b-838b-42d7-bf8d-1db87b675c57" FOREIGN KEY ("run_detector_id") REFERENCES "runs_detectors"("id")  ;

ALTER TABLE "sim_and_data_passess" ADD CONSTRAINT "FK_ed9ce911-7f59-45b8-b0c6-2bc7d0bfda03" FOREIGN KEY ("data_pass_id") REFERENCES "data_passes"("id")  ;

ALTER TABLE "sim_and_data_passess" ADD CONSTRAINT "FK_dc70d200-e000-4e65-89f9-e4ff5ac59d39" FOREIGN KEY ("sim_pass_id") REFERENCES "simulation_passes"("id")  ;
