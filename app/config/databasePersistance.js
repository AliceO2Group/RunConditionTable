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

module.exports = {
    detectors: detectors.sort(),
    healthcheckQueries: [`INSERT INTO detectors_subsystems(id, name) VALUES ${detectors.map((d) => `(DEFAULT, ${d})`).join(',')};`],

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
