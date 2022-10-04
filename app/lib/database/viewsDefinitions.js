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
            r.time_start, 
            r.time_end, 
            r.time_trg_start, 
            r.time_trg_end,
            r.energy_per_beam, 
            r.ir, 
            r.filling_scheme, 
            r.triggers_conf,
            r.fill_number,
            r.mu, 
            r.l3_current,
            r.dipole_current
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
                --p.name, 
                r.run_number, 
                r.time_start, 
                r.time_end, 
                r.time_trg_start, 
                r.time_trg_end,
                r.energy_per_beam, 
                r.ir, 
                r.filling_scheme, 
                r.triggers_conf,
                r.fill_number,
                r.mu, 
                r.l3_current,
                r.dipole_current
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
        LEFT JOIN pass_types AS pt
            ON pt.id = dp.pass_type
        WHERE dp.period_id = (SELECT id from periods WHERE name ='${query.index}')
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
        WHERE sp.name LIKE '${query.index}%'
        )`;

const anchored_per_mc_view = (query) => `
    WITH anchored_per_mc_view AS (
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
        LEFT JOIN pass_types AS pt
            ON pt.id = dp.pass_type
        INNER JOIN sim_and_data_passes as sadp
            ON sadp.data_pass_id = dp.id
        INNER JOIN simulation_passes as sp
            ON sp.id = sadp.sim_pass_id
        WHERE sp.name = '${query.index}'
    )`;

const anchorage_per_data_pass_view = (query) => `
    WITH anchorage_per_data_pass_view AS (
        SELECT
            --sp.id
            sp.name,
            sp.description,
            sp.jira,
            sp.ml,
            sp.pwg,
            sp.number_of_events
        FROM simulation_passes AS sp
        INNER JOIN sim_and_data_passes as sadp
            ON sp.id = sadp.sim_pass_id
        INNER JOIN data_passes as dp
            ON dp.id = sadp.data_pass_id
        WHERE dp.name = '${query.index}'
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

module.exports = {period_view, runs_per_period_view, runs_per_data_pass_view, mc_view, anchored_per_mc_view,  data_passes_view, anchorage_per_data_pass_view, flags_view}