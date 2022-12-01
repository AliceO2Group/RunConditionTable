/* eslint-disable max-len */
const detectors = [
    'CPV',
    'EMC',
    'FDD',
    'FT0',
    'FV0',
    'ITS',
    'HMP',
    'MCH',
    'MFT',
    'MID',
    'PHS',
    'TOF',
    'TPC',
    'TRD',
    'TST',
    'ZDC',
];

const particle_phys_data = {
    p: {
        full_name: 'proton',
        Z: 1,
        A: 1,
    },
    Pb: {
        full_name: 'lead',
        Z: 83,
        A: 207,
    },
    O: {
        full_name: 'oxygen',
        A: 8,
        Z: 16,
    },
    Xe: {
        full_name: 'xenon',
        A: 54,
        Z: 131,
    },
};

module.exports = {
    suppressHealthcheckLogs: true,

    detectors: detectors.sort(),
    healthcheckQueries: {
        detectors: {
            description: '',
            query: detectors.map((d) => `INSERT INTO detectors_subsystems("id", "name") VALUES (DEFAULT, '${d}');`),
        },
        particle: {
            description: '',
            query: Object.entries(particle_phys_data).map(([name, d]) => `INSERT INTO particle_phys_data("id", "name", "full_name", "A", "Z")
                    VALUES (DEFAULT, '${name}', '${d.full_name}', ${d.A}, ${d.Z});`),
        },
    },

    beam_type_mappings: {
        pp: 'p-p',
        nn: 'n-n',
        XeXe: 'Xe-Xe',
        PbPb: 'Pb-Pb',
        pPb: 'p-Pb',
        Pbp: 'p-Pb',
        pA: 'p-A',
    },

};
