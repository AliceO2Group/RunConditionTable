const period_view = `
    WITH period_view AS (
        SELECT DISTINCT
            --p.id    
            p.name, 
            p.year, 
            (
                SELECT beam_type
                FROM beams_dictionary
                AS bd where bd.id = p.beam_type_id
            ) AS beam,
            r.energy_per_beam::integer as energy
        FROM periods AS p
        LEFT JOIN runs as r
            ON r.period_id = p.id
    )`;

const runs_per_period_view = (query) => `
    WITH runs_per_period_view AS (
        SELECT
            --r.id
            --p.name, 
            r.run_number, 
            r.start, 
            r.end AS "end", 
            r.b_field, 
            r.energy_per_beam, 
            r.ir, 
            r.filling_scheme, 
            r.triggers_conf,
            r.fill_number, 
            r.run_type, 
            r.mu, 
            r.time_trg_start, 
            r.time_trg_end
        FROM runs AS r
            INNER JOIN periods AS p
            ON p.id = r.period_id
        WHERE period_id = (
                            SELECT id 
                            FROM periods 
                            WHERE periods.name = '${query.index}'
                            )
        ORDER BY r.run_number DESC
        )`;

const runs_per_data_pass_view = (query) => `
        WITH runs_per_data_pass_view AS (
            SELECT
                --r.id
                -- dp.name, 
                r.run_number, 
                r.start, 
                r.end AS "end", 
                r.b_field, 
                r.energy_per_beam, 
                r.ir, 
                r.filling_scheme, 
                r.triggers_conf,
                r.fill_number, 
                r.run_type, 
                r.mu, 
                r.time_trg_start, 
                r.time_trg_end
            FROM data_passes AS dp
                INNER JOIN data_passes_runs AS dpr
                    ON dp.id=dpr.data_pass_id
                INNER JOIN runs AS r
                    ON r.id=dpr.run_id
            WHERE dp.name = '${query.index}'
            ORDER BY r.run_number DESC
            )`;

const data_passes_view = (query) => `
    WITH data_passes_view AS (
        SELECT
            --dp.id
            dp.name,
            dp.description,
            pt.pass_type,
            dp.jira,
            dp.ml,
            dp.number_of_events,
            dp.software_version,
            dp.size
        FROM data_passes AS dp
        INNER JOIN pass_types AS pt
            ON pt.id = dp.pass_type
        WHERE exists (
                        SELECT *
                        FROM runs AS r
                        INNER JOIN
                        data_passes_runs AS dpr
                            ON r.id = dpr.run_id
                        INNER JOIN data_passes AS dp
                            ON dp.id = dpr.data_pass_id
                        WHERE r.period_id = (
                                            SELECT id 
                                            FROM periods AS p 
                                            WHERE p.name = '${query.index}')
                                            )
        )`;

const mc_view = (query) => `
    WITH mc_view AS (
        SELECT
            --sp.id
            sp.name,
            sp.description,
            sp.jira,
            sp.ml,
            sp.pwg,
            sp.number_of_events
        FROM simulation_passes AS sp 
        WHERE exists (
                        SELECT * 
                        FROM runs AS r 
                        INNER JOIN simulation_passes_runs AS spr 
                            ON r.id = spr.run_id 
                        INNER JOIN simulation_passes AS sp 
                            ON sp.id = spr.simulation_pass_id 
                        WHERE r.period_id = (
                                            SELECT id 
                                            FROM periods as p 
                                            WHERE p.name = '${query.index}'
                                            )
                        ) 
        )`;

const flags_view = (query) => `
    WITH flags_view AS (
        SELECT
            --qcf.id, 
            qcf.start AS flagStart, 
            qcf.end AS flagEnd, 
            ftd.flag, 
            qcf.comment, 
            dpr.data_pass_id,
            ds.name

        FROM quality_control_flags AS qcf
        INNER JOIN data_passes_runs as dpr
            ON dpr.id = qcf.pass_run_id
        INNER JOIN runs_detectors as rd
            ON qcf.run_detector_id = rd.id
        INNER JOIN detectors_subsystems AS ds
            ON ds.id = rd.detector_id
        INNER JOIN flags_types_dictionary as ftd
            ON ftd.id = qcf.flag_type_id
        
        WHERE rd.run_id = ${query.index}
        
    )`;

module.exports = {period_view, runs_per_period_view, runs_per_data_pass_view, mc_view, data_passes_view, flags_view}