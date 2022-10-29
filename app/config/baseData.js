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
    database: {
        detectors: detectors.sort(),
        healthcheckQueries: [`INSERT INTO detectors_subsystems(id, name) VALUES ${detectors.map((d) => `(DEFAULT, ${d})`).join(',')};`],
    },
};
