/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const periods_view = () => `
    SELECT DISTINCT
        --p.id    
        p.name, 
        p.year, 
        (
            SELECT beam_type
            FROM beams_dictionary AS bd 
                where bd.id = p.beam_type_id
        ) AS beam,
        array_agg(get_center_of_mass_energy(r.energy_per_beam, p.beam_type_id)) as energies
    FROM periods AS p
    LEFT JOIN runs as r
        ON r.period_id = p.id
    GROUP BY p.name, p.year, beam
`;

module.exports = periods_view;